# AI Memory

루트 [`CLAUDE.md`](../../CLAUDE.md)는 프로젝트 전역 AI 메모리의 원본이다. 루트 [`AGENTS.md`](../../AGENTS.md)는 해당 파일을 참조하는 호환 진입점이다.

## Pairing Rule

하위 디렉터리에 추가 규칙이 필요할 때만 같은 위치에 `CLAUDE.md`와 `AGENTS.md`를 함께 둔다.

| 파일 | 역할 |
| --- | --- |
| `CLAUDE.md` | 해당 디렉터리 범위의 추가 규칙 원본 |
| `AGENTS.md` | 같은 디렉터리의 `CLAUDE.md` 참조 |

공통 내용을 하위 파일에 복제하지 않는다. 하위 규칙은 루트 규칙에 추가되는 내용만 가진다.

## Templates

- [`templates/CLAUDE.md`](templates/CLAUDE.md)
- [`templates/AGENTS.md`](templates/AGENTS.md)
