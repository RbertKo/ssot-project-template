import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, cpSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { audit, readMetadata } from './ssot-docs.mjs';

function fixture(context) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'ssot-docs-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  const directories = ['product/capabilities', 'product/prd', 'architecture/adr', 'architecture/api', 'design/decisions', 'governance'];
  for (const directory of directories) {
    mkdirSync(path.join(root, 'docs', directory), { recursive: true });
    writeFileSync(path.join(root, 'docs', directory, 'README.md'), '# 안내\n\n<!-- ssot-index:start -->\n<!-- ssot-index:end -->\n\n수동 작성한 역사와 근거\n');
  }
  const write = (relativePath, metadata) => writeFileSync(path.join(root, relativePath), `---\n${metadata}\n---\n\n# 본문\n`);
  write('docs/product/capabilities/CAP-001-core.md', 'id: CAP-001\ntitle: Core\nlifecycle: Active\nparent_capability: null');
  write('docs/product/prd/PRD-001-first.md', 'id: PRD-001\ntitle: First | Second\nstatus: ToDo\npriority: High\nowner: Codex\ndue_date: null\ncapability_refs: [CAP-001]');
  return { root, write };
}

test('CRLF·인라인/블록 ID 목록·인용 필드를 읽고 비지원 형식은 거부한다', () => {
  assert.deepEqual(readMetadata('---\r\nid: PRD-001\r\ntitle: "제목"\r\ncapability_refs:\r\n  - CAP-001\r\n  - CAP-002\r\ndepends_on: [PRD-002]\r\n---\r\n'), {
    id: 'PRD-001', title: '제목', capability_refs: ['CAP-001', 'CAP-002'], depends_on: ['PRD-002'],
  });
  assert.throws(() => readMetadata('---\ntitle: >\n  folded\n---\n'), /단일 행/);
  assert.throws(() => readMetadata('---\ntitle: First\n  Second\n---\n'), /단일 행/);
  assert.throws(() => readMetadata('---\nrelated_prds:\n- PRD-001\n---\n'), /들여써야/);
  assert.throws(() => readMetadata('---\nid: PRD-001\nid: PRD-002\n---\n'), /중복/);
  assert.throws(() => readMetadata('---\ncapability_refs: CAP-001\n---\n'), /목록/);
  assert.throws(() => readMetadata('---\ncapability_refs: [CAP-001, typo]\n---\n'), /CAP ID/);
  assert.deepEqual(readMetadata('---\ncapability_refs: [CAP-001] # CAP-999는 참고\n---\n').capability_refs, ['CAP-001']);
  assert.deepEqual(readMetadata('---\nrelated_designs: [DDR-001, components.md, "guide,extra.md"]\n---\n').related_designs, ['DDR-001', 'components.md', 'guide,extra.md']);
  assert.deepEqual(readMetadata('---\ncapability_refs:\n  - CAP-001\n  # 설명\n\n  - CAP-999\nstatus: ToDo\n---\n').capability_refs, ['CAP-001', 'CAP-999']);
  assert.throws(() => readMetadata('---\nstatus: "Active\n---\n'), /인용부호/);
  assert.throws(() => readMetadata('---\nstatus: [Active]\n---\n'), /배열/);
  assert.deepEqual(readMetadata('---\nrelated_designs: ["guide # 1.md"]\n---\n').related_designs, ['guide # 1.md']);
});

test('누락·중복·상태 드리프트를 복원하고 CAP 역참조를 생성하며 재실행은 무변경이다', context => {
  const { root } = fixture(context);
  assert.ok(audit(root).errors.some(error => error.includes('파생 인덱스')));
  const result = audit(root, { write: true });
  assert.deepEqual(result.errors, []);
  assert.equal(result.updatedCount, 5);
  const indexPath = path.join(root, 'docs/product/prd/README.md');
  const correct = readFileSync(indexPath, 'utf8');
  assert.match(correct, /First &#124; Second/);
  assert.match(correct, /수동 작성한 역사와 근거/);
  assert.match(readFileSync(path.join(root, 'docs/product/capabilities/README.md'), 'utf8'), /PRD-001/);
  const row = correct.split('\n').find(line => line.startsWith('| PRD-001'));
  writeFileSync(indexPath, correct.replace(row, `${row.replace('ToDo', 'Done')}\n${row}`));
  assert.ok(audit(root).errors.length > 0);
  audit(root, { write: true });
  assert.equal(readFileSync(indexPath, 'utf8'), correct);
  assert.equal(audit(root, { write: true }).updatedCount, 0);
});

test('존재하지 않는 CAP와 순환 관계를 거부하고 오류 시 인덱스를 쓰지 않는다', context => {
  const { root, write } = fixture(context);
  write('docs/product/capabilities/CAP-001-core.md', 'id: CAP-001\ntitle: Core\nlifecycle: Active\nparent_capability: CAP-001');
  write('docs/product/prd/PRD-001-first.md', 'id: PRD-001\ntitle: First\nstatus: ToDo\npriority: High\nowner: Codex\ndue_date: null\ncapability_refs: [CAP-999]');
  const indexPath = path.join(root, 'docs/product/prd/README.md');
  const before = readFileSync(indexPath, 'utf8');
  const result = audit(root, { write: true });
  assert.ok(result.errors.some(error => error.includes('CAP-999')));
  assert.ok(result.errors.some(error => error.includes('순환')));
  assert.equal(readFileSync(indexPath, 'utf8'), before);
});

test('생성 구역 밖에 남은 별도 인덱스와 중복 마커를 거부한다', context => {
  const { root } = fixture(context);
  audit(root, { write: true });
  const indexPath = path.join(root, 'docs/product/prd/README.md');
  const original = readFileSync(indexPath, 'utf8');
  writeFileSync(indexPath, `${original}\n| PRD-001 | 오래된 별도 행 |\n`);
  assert.ok(audit(root).errors.some(error => error.includes('생성 구역 밖')));
  writeFileSync(indexPath, `${original}\n<!-- ssot-index:start -->\n`);
  assert.ok(audit(root).errors.some(error => error.includes('마커')));
});

test('중복 ID·누락 API 상태는 예외 없이 실패한다', context => {
  const { root, write } = fixture(context);
  write('docs/architecture/adr/ADR-001-first.md', 'id: ADR-001\ntitle: First\nstatus: Accepted');
  write('docs/architecture/adr/ADR-001-second.md', 'id: ADR-001\ntitle: Second\nstatus: Accepted');
  write('docs/architecture/api/API-001-first.md', 'id: API-001\ntitle: Contract\nversion: v1.0.0');
  const result = audit(root, { write: true });
  assert.ok(result.errors.some(error => error.includes('중복 ID')));
  assert.ok(result.errors.some(error => error.includes('status 누락')));
  assert.equal(result.updatedCount, 0);
});

test('잘못된 상태·의존성·ID 형식을 거부한다', context => {
  const { root, write } = fixture(context);
  write('docs/architecture/api/API-001-first.md', 'id: API-001\ntitle: Contract\nstatus: null\nversion: v1.0.0');
  write('docs/architecture/adr/ADR-002-second.md', 'id: ADR-002\ntitle: Decision\nstatus: Invalid\nrelated_prds: [PRD-999]');
  write('docs/architecture/adr/ADR-wrong-id.md', 'id: ADR-wrong\ntitle: Decision\nstatus: Accepted');
  write('docs/product/prd/PRD-002-second.md', 'id: PRD-002\ntitle: Second\nstatus: ToDo\npriority: Invalid\nowner: Unassigned\ndue_date: null\ncapability_refs: [CAP-001]\ndepends_on: [PRD-999]');
  const result = audit(root);
  for (const message of ['status 누락', 'status 허용', 'ID 형식', 'priority 허용', 'related_prds 대상 없음', 'depends_on 대상 없음']) assert.ok(result.errors.some(error => error.includes(message)), message);
});

test('실제 보일러플레이트는 빈 상태와 첫 CAP·PRD·ADR·DDR·API 등록 모두 작동한다', context => {
  const { root } = fixture(context);
  rmSync(path.join(root, 'docs'), { recursive: true });
  const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  cpSync(path.join(repository, 'docs'), path.join(root, 'docs'), { recursive: true });
  assert.deepEqual(audit(root).errors, []);
  assert.equal(audit(root).documentCount, 0);
  for (const [directory, prefix] of [['product/capabilities', 'CAP'], ['product/prd', 'PRD'], ['architecture/adr', 'ADR'], ['design/decisions', 'DDR'], ['architecture/api', 'API']]) {
    const template = readFileSync(path.join(root, 'docs', directory, `${prefix}-000-template.md`), 'utf8');
    const document = template.replaceAll(`${prefix}-000`, `${prefix}-001`).replace('capability_refs: []', 'capability_refs: [CAP-001]');
    writeFileSync(path.join(root, 'docs', directory, `${prefix}-001-example.md`), document);
  }
  assert.ok(audit(root).errors.some(error => error.includes('파생 인덱스')));
  assert.deepEqual(audit(root, { write: true }).errors, []);
  const result = audit(root);
  assert.equal(result.documentCount, 5);
  assert.deepEqual(result.errors, []);
  assert.equal(audit(root, { write: true }).updatedCount, 0);
});
