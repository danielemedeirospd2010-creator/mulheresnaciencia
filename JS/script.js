document.documentElement.classList.add("js"); /* avisa o CSS que o JavaScript está funcionando */
/* ===== Mulheres na Ciência - JavaScript =====
   Este arquivo é usado por todas as páginas; cada recurso só
   é ativado se os elementos correspondentes existirem na página. */

/* 1. Menu responsivo (celular) */
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('menu');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const aberto = nav.classList.toggle('aberto');
    menuBtn.setAttribute('aria-expanded', aberto);
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('aberto')));
}

/* 2. Animação de entrada ao rolar a página */
const itens = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  itens.forEach(i => obs.observe(i));
} else {
  itens.forEach(i => i.classList.add('visivel'));
}

/* 3. Fotos: se a imagem não existir na pasta imagens/, mostra um quadro no lugar */
function trocarPorQuadro(img) {
  const div = document.createElement('div');
  div.className = 'foto-vazia';
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label', img.alt);
  div.textContent = img.dataset.iniciais || '♀';
  img.replaceWith(div);
}
document.querySelectorAll('img.foto').forEach(img => {
  img.addEventListener('error', () => trocarPorQuadro(img));
  /* se a imagem já falhou antes do script carregar */
  if (img.complete && img.naturalWidth === 0) trocarPorQuadro(img);
});

/* 4. Ano atual no rodapé */
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

/* 5. Quiz interativo */
const quizBox = document.getElementById('quiz');
if (quizBox) {
  const perguntas = [
    { p: 'Qual cientista descobriu o Kevlar?', o: ['Marie Curie', 'Stephanie Kwolek', 'Tatiana Sampaio'], c: 1 },
    { p: 'Em que ano Stephanie Kwolek descobriu o Kevlar?', o: ['1965', '1900', '1999'], c: 0 },
    { p: 'Para que serve o Kevlar?', o: ['Fazer perfumes', 'Fabricar coletes de proteção e outros itens resistentes', 'Produzir vidro'], c: 1 },
    { p: 'Tatiana Sampaio pesquisa a polilaminina, que busca ajudar em qual tipo de problema?', o: ['Lesões na medula espinhal', 'Problemas de visão', 'Falta de vitaminas'], c: 0 },
    { p: 'Tatiana Sampaio é cientista de qual país?', o: ['Portugal', 'Estados Unidos', 'Brasil'], c: 2 }
  ];
  let atual = 0, pontos = 0;
  const el = {
    prog: quizBox.querySelector('.progresso div'),
    area: document.getElementById('quiz-pergunta'),
    fim: document.getElementById('quiz-fim'),
    nota: document.getElementById('quiz-nota'),
    msg: document.getElementById('quiz-msg'),
    reiniciar: document.getElementById('quiz-reiniciar')
  };

  function mostrar() {
    const q = perguntas[atual];
    el.fim.hidden = true; el.area.hidden = false;
    el.prog.style.width = (atual / perguntas.length * 100) + '%';
    el.area.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = `${atual + 1}/${perguntas.length} — ${q.p}`;
    const fb = document.createElement('p');
    fb.className = 'feedback'; fb.setAttribute('aria-live', 'polite');
    const prox = document.createElement('button');
    prox.className = 'btn'; prox.hidden = true;
    prox.textContent = atual === perguntas.length - 1 ? 'Ver pontuação' : 'Próxima pergunta';
    prox.addEventListener('click', () => { atual++; atual < perguntas.length ? mostrar() : terminar(); });

    const botoes = q.o.map((texto, i) => {
      const b = document.createElement('button');
      b.className = 'opcao'; b.textContent = texto;
      b.addEventListener('click', () => {
        botoes.forEach(x => x.disabled = true);
        botoes[q.c].classList.add('certa');
        if (i === q.c) { pontos++; fb.textContent = '✅ Acertou! Parabéns!'; }
        else { b.classList.add('errada'); fb.textContent = '❌ Não foi dessa vez. A resposta certa está destacada.'; }
        prox.hidden = false; prox.focus();
      });
      return b;
    });
    el.area.append(h, ...botoes, fb, prox);
  }

  function terminar() {
    el.prog.style.width = '100%';
    el.area.hidden = true; el.fim.hidden = false;
    el.nota.textContent = `${pontos} de ${perguntas.length}`;
    el.msg.textContent = pontos === perguntas.length ? 'Perfeito! Você conhece bem essas cientistas! 🌟'
      : pontos >= 3 ? 'Muito bem! Releia as histórias e tente de novo.'
      : 'Leia as páginas das cientistas e tente novamente!';
  }
  el.reiniciar.addEventListener('click', () => { atual = 0; pontos = 0; mostrar(); });
  mostrar();
}

/* 6. Formulário de sugestões (validação no navegador) */
const form = document.getElementById('form-sugestao');
if (form) {
  const regras = {
    nome: v => v.trim().length >= 3 || 'Digite seu nome (mínimo 3 letras).',
    cientista: v => v.trim().length >= 3 || 'Digite o nome da cientista sugerida.',
    motivo: v => v.trim().length >= 20 || 'Explique o motivo com pelo menos 20 caracteres.'
  };
  function validar(campo) {
    const r = regras[campo.name](campo.value);
    const erro = campo.parentElement.querySelector('.erro');
    campo.classList.toggle('invalido', r !== true);
    erro.textContent = r === true ? '' : r;
    return r === true;
  }
  form.querySelectorAll('input,textarea').forEach(c => c.addEventListener('blur', () => validar(c)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input,textarea')];
    if (!campos.map(validar).every(Boolean)) return;
    const conf = document.getElementById('confirmacao');
    conf.hidden = false;
    conf.textContent = `Obrigada, ${form.nome.value.trim()}! Sua sugestão (${form.cientista.value.trim()}) foi validada. ` +
      'Atenção: este site não tem servidor, então a sugestão não fica guardada.';
    form.reset();
  });
}