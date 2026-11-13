import { SFX } from '../src/audio/cues.js';
import { CENAS } from '../src/Video.jsx';
import { N, DURACAO, MUS, FIM } from '../src/audio/timeline.js';
console.log(JSON.stringify({ sfx: SFX(), cenas: CENAS().map(([c, a, b]) => [c.name, a, b]), N, FIMS: N.map((_, i) => FIM(i + 1)), DURACAO, MUS: { V2: MUS.V2, V3: MUS.V3, V4: MUS.V4, freeze: MUS.freeze, silencio: MUS.silencio, musica: MUS.musica } }));
