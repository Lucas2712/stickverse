// o CSS não entra por aqui: vem em <link> no index.html (src/styles/site.css). Importado pelo JS, a página
// aparecia crua por um instante ao recarregar.
import './motion/rolando.js';
import { criarScroll } from './motion/smooth.js';
import { criarGuia } from './motion/guia.js';
import { scrollbar } from './motion/scrollbar.js';
import { criarFilme } from './motion/filme.js';
import { criarLoja } from './motion/loja.js';
import { criarMenu } from './motion/menu.js';
import { criarTour } from './motion/tour.js';

document.documentElement.classList.add('js');
// recarregar volta sempre ao topo: o hero é o carregamento, e a altura do filme só existe depois do JS (com a
// restauração do navegador, às vezes voltava ao meio, às vezes não)
history.scrollRestoration = 'manual';

const lenis = criarScroll();
criarGuia({ lenis });
scrollbar({ lenis });
criarFilme({ lenis });
criarLoja({ lenis });
criarMenu({ lenis });
criarTour({ lenis });
