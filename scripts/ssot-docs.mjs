import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const groups = [
  { prefix: 'CAP', directory: 'docs/product/capabilities', fields: ['id', 'title', 'lifecycle', 'parent_capability', 'prd_refs'], headers: ['ID', '제목', 'Lifecycle', '상위 Capability', '연결 PRD', '문서'] },
  { prefix: 'PRD', directory: 'docs/product/prd', fields: ['id', 'title', 'capability_refs', 'status', 'priority', 'owner', 'due_date'], headers: ['ID', '제목', 'Capability', '상태', '우선순위', '담당자', 'Due Date', '문서'] },
  { prefix: 'ADR', directory: 'docs/architecture/adr', fields: ['id', 'title', 'status', 'related_prds'], headers: ['ID', '제목', '상태', '관련 PRD', '문서'] },
  { prefix: 'API', directory: 'docs/architecture/api', fields: ['id', 'title', 'version', 'status', 'related_prds', 'related_adrs'], headers: ['ID', '제목', '현재 버전', '상태', '관련 PRD', '관련 ADR', '문서'] },
  { prefix: 'DDR', directory: 'docs/design/decisions', fields: ['id', 'title', 'status', 'related_prds', 'related_designs'], headers: ['ID', '제목', '상태', '관련 PRD', '관련 디자인', '문서'] },
];
const beginMarker = '<!-- ssot-index:start -->';
const endMarker = '<!-- ssot-index:end -->';
const statuses = {
  CAP: ['Proposed', 'Active', 'Retired'],
  PRD: ['ToDo', 'InProgress', 'Hold', 'Done', 'Cancel'],
  ADR: ['Proposed', 'Accepted', 'Superseded', 'Rejected'],
  DDR: ['Proposed', 'Accepted', 'Superseded', 'Rejected'],
  API: ['Draft', 'Active', 'Deprecated', 'Retired'],
};

function scalar(value) {
  const trimmed = value.trim();
  if (/^["']/.test(trimmed)) {
    const match = trimmed.match(/^("(?:\\.|[^"\\])*"|'(?:''|[^'])*')(?:\s+#.*)?$/);
    if (!match) throw new Error('단일 행 필드의 인용부호 또는 주석 형식이 잘못됐습니다');
    if (match[1].startsWith('"')) return JSON.parse(match[1]);
    return match[1].slice(1, -1).replaceAll("''", "'");
  }
  if (/^[\[\]{},]/.test(trimmed)) throw new Error('단일 행 필드에 배열 또는 객체를 사용할 수 없습니다');
  return trimmed.replace(/\s+#.*$/, '');
}

function inlineList(source) {
  const values = [];
  let current = '';
  let quote = null;
  for (let index = 1; index < source.length - 1; index += 1) {
    const character = source[index];
    if (quote && character === '\\' && quote === '"') {
      current += character + source[++index];
      continue;
    }
    if (character === quote) quote = null;
    else if (!quote && (character === '"' || character === "'")) quote = character;
    if (character === ',' && !quote) { values.push(scalar(current)); current = ''; }
    else current += character;
  }
  if (quote) throw new Error('목록의 인용부호가 닫히지 않았습니다');
  if (current.trim()) values.push(scalar(current));
  return values;
}

// 일반 YAML 로더가 아니다. 인덱스에 쓰는 최상위 단일 행 필드와 참조 목록만 읽는다.
// reason 등 기존 문서의 자유 서술은 해석하지 않고 원본에 보존한다.
export function readMetadata(markdown) {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error('frontmatter가 없습니다');
  const metadata = {};
  const lines = frontmatter[1].split(/\r?\n/);
  const scalarFields = new Set(['id', 'title', 'lifecycle', 'parent_capability', 'status', 'priority', 'owner', 'due_date', 'version']);
  const listFields = new Set(['capability_refs', 'related_prds', 'related_adrs', 'related_designs', 'depends_on']);
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([a-z_]+):\s*(.*)$/);
    if (!match || (!scalarFields.has(match[1]) && !listFields.has(match[1]))) continue;
    const [, key, rawValue] = match;
    if (Object.hasOwn(metadata, key)) throw new Error(`중복 메타데이터: ${key}`);
    if (listFields.has(key)) {
      // 닫는 대괄호 뒤의 주석만 제거해 인용 문자열 안의 #를 보존한다.
      const source = rawValue.replace(/(\])\s+#.*$/, '$1').replace(/^#.*$/, '');
      let identifiers;
      if (!source) {
        const items = [];
        while (index + 1 < lines.length) {
          const next = lines[index + 1];
          if (/^\s*(?:#.*)?$/.test(next)) { index += 1; continue; }
          if (/^\s+-\s+/.test(next)) { items.push(scalar(lines[++index].replace(/^\s+-\s+/, ''))); continue; }
          if (/^-/.test(next)) throw new Error(`${key}: 목록 항목을 들여써야 합니다`);
          if (/^\s+\S/.test(next)) throw new Error(`${key}: 중첩 목록이나 여러 줄 값은 지원하지 않습니다`);
          break;
        }
        identifiers = items;
      } else if (!/^\[.*\]$/.test(source)) {
        throw new Error(`${key}: 한 줄 배열 또는 들여쓴 참조 목록이 필요합니다`);
      } else identifiers = inlineList(source);
      if (key === 'capability_refs') {
        if (identifiers.some(identifier => !/^CAP-\d+$/.test(identifier))) throw new Error('capability_refs: CAP ID 외의 값이 있습니다');
      }
      metadata[key] = identifiers;
    } else {
      if (/^[|>]/.test(rawValue)) throw new Error(`${key}: 인덱스 필드는 단일 행이어야 합니다`);
      if (/^\s+\S/.test(lines[index + 1] ?? '') && !/^\s*#/.test(lines[index + 1])) throw new Error(`${key}: 인덱스 필드는 단일 행이어야 합니다`);
      metadata[key] = scalar(rawValue);
    }
  }
  return metadata;
}

function cell(value) {
  const text = Array.isArray(value) ? value.join(', ') : value;
  return String(text || '—').replaceAll('|', '&#124;').replaceAll('\n', ' ');
}

export function buildTable(group, documents, allDocuments) {
  const lines = [
    `| ${group.headers.join(' | ')} |`,
    `| ${group.headers.map(() => '---').join(' | ')} |`,
  ];
  for (const document of documents) {
    const metadata = { ...document.metadata };
    if (group.prefix === 'CAP') {
      metadata.prd_refs = allDocuments.filter(candidate => candidate.prefix === 'PRD' && candidate.metadata.capability_refs?.includes(metadata.id)).map(candidate => candidate.metadata.id);
    }
    lines.push(`| ${group.fields.map(field => cell(metadata[field])).join(' | ')} | [${metadata.id}](${document.filename}) |`);
  }
  return `${beginMarker}\n${lines.join('\n')}\n${endMarker}`;
}

export function audit(root, { write = false } = {}) {
  const errors = [];
  const documents = [];
  for (const group of groups) {
    for (const filename of readdirSync(path.join(root, group.directory)).sort()) {
      if (!filename.startsWith(`${group.prefix}-`) || !filename.endsWith('.md') || filename === `${group.prefix}-000-template.md`) continue;
      const relativePath = `${group.directory}/${filename}`;
      try {
        const metadata = readMetadata(readFileSync(path.join(root, relativePath), 'utf8'));
        for (const field of group.fields.filter(field => field !== 'prd_refs' && !field.endsWith('_refs') && !field.startsWith('related_'))) {
          if (!metadata[field] || (!['due_date', 'parent_capability'].includes(field) && ['null', '~'].includes(metadata[field]))) {
            errors.push(`${relativePath}: ${field} 누락`);
          }
        }
        if (!new RegExp(`^${group.prefix}-\\d{3,}$`).test(metadata.id) || metadata.id === `${group.prefix}-000`) errors.push(`${relativePath}: ID 형식 오류 또는 예약된 000 ID`);
        if (!filename.startsWith(`${metadata.id}-`) || !/^[A-Z]+-\d{3,}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) errors.push(`${relativePath}: 파일명과 id 불일치 또는 slug 형식 오류`);
        const statusField = group.prefix === 'CAP' ? 'lifecycle' : 'status';
        if (!statuses[group.prefix].includes(metadata[statusField])) errors.push(`${relativePath}: ${statusField} 허용 어휘 위반`);
        if (group.prefix === 'PRD' && !['Urgent', 'High', 'Medium', 'Low'].includes(metadata.priority)) errors.push(`${relativePath}: priority 허용 어휘 위반`);
        documents.push({ prefix: group.prefix, filename, relativePath, metadata });
      } catch (error) {
        errors.push(`${relativePath}: ${error.message}`);
      }
    }
  }
  const byId = new Map();
  for (const document of documents) byId.set(document.metadata.id, [...(byId.get(document.metadata.id) ?? []), document]);
  for (const [identifier, matches] of byId) {
    if (matches.length > 1) errors.push(`${identifier}: 중복 ID (${matches.map(document => document.relativePath).join(', ')})`);
  }
  for (const document of documents) {
    const { metadata } = document;
    for (const [field, prefix] of [['depends_on', 'PRD'], ['related_prds', 'PRD'], ['related_adrs', 'ADR']]) {
      for (const identifier of metadata[field] ?? []) {
        if (!identifier.startsWith(`${prefix}-`) || !byId.has(identifier)) errors.push(`${document.relativePath}: ${field} 대상 없음 ${identifier}`);
      }
    }
    if (document.prefix === 'PRD') {
      if (!metadata.capability_refs?.length) errors.push(`${document.relativePath}: capability_refs가 비었습니다`);
      for (const identifier of metadata.capability_refs ?? []) {
        if (!identifier.startsWith('CAP-') || !byId.has(identifier)) errors.push(`${document.relativePath}: 존재하지 않는 capability ${identifier}`);
      }
    }
    if (document.prefix === 'CAP' && metadata.parent_capability !== 'null') {
      const parent = metadata.parent_capability;
      if (!parent?.startsWith('CAP-') || !byId.has(parent)) errors.push(`${document.relativePath}: 존재하지 않는 상위 capability ${parent}`);
      const visited = new Set([metadata.id]);
      let current = parent;
      while (current && current !== 'null' && byId.has(current)) {
        if (visited.has(current)) { errors.push(`${document.relativePath}: capability 상위 관계 순환`); break; }
        visited.add(current);
        current = byId.get(current)[0].metadata.parent_capability;
      }
    }
  }
  const updates = [];
  for (const group of groups) {
    const relativePath = `${group.directory}/README.md`;
    const original = readFileSync(path.join(root, relativePath), 'utf8');
    const start = original.indexOf(beginMarker);
    const end = original.indexOf(endMarker);
    if (start < 0 || end < start || original.indexOf(beginMarker, start + 1) >= 0 || original.indexOf(endMarker, end + 1) >= 0) {
      errors.push(`${relativePath}: 인덱스 생성 구역 마커가 없거나 중복됐습니다`);
      continue;
    }
    const generated = buildTable(group, documents.filter(document => document.prefix === group.prefix), documents);
    const outside = original.slice(0, start) + original.slice(end + endMarker.length);
    if (new RegExp(`^\\|\\s*${group.prefix}-[A-Za-z0-9-]+\\s*\\|`, 'm').test(outside)) {
      errors.push(`${relativePath}: 생성 구역 밖에 별도 인덱스 행이 있습니다`);
    }
    const expected = original.slice(0, start) + generated + original.slice(end + endMarker.length);
    if (original !== expected) updates.push({ relativePath, content: expected });
  }
  // 원본에 오류가 있으면 일부 인덱스만 덮어쓰지 않는다.
  if (write && errors.length === 0) {
    for (const update of updates) writeFileSync(path.join(root, update.relativePath), update.content);
  } else {
    for (const update of updates) errors.push(`${update.relativePath}: 파생 인덱스 불일치 — node scripts/ssot-docs.mjs --write`);
  }
  return { errors, documentCount: documents.length, updatedCount: write && errors.length === 0 ? updates.length : 0 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.some(argument => argument !== '--write')) {
    console.error('사용법: node scripts/ssot-docs.mjs [--write]');
    process.exitCode = 1;
  } else {
    const result = audit(repositoryRoot, { write: argumentsList.includes('--write') });
    for (const error of result.errors) console.error(`오류: ${error}`);
    console.log(`SSoT 문서 ${result.documentCount}개, 오류 ${result.errors.length}개, 인덱스 갱신 ${result.updatedCount}개`);
    process.exitCode = result.errors.length ? 1 : 0;
  }
}
