# Preferência ao paradigma de programação funcional

* O paradigma funcional facilita a escrita de códigos modulares, desacoplados, facilmente testáveis, sem efeitos colaterais e de fácil manutenção. Algumas técnicas básicas podem ajudar a cumprir estes objetivos:
  * Funções puras: são funções que operam apenas com seus parâmetros
  * Imutabilidade: abandono das variáveis pelas constantes. Em Javascript, isso pode ser uma tarefa difícil, e existem algumas bibliotecas que ajudam nesse processo ([Immutable](https://facebook.github.io/immutable-js/))
  * Uso de recursões ao invés de loops, o que auxilia na conquista da imutabilidade
  * Higher-order-functions: são funções que aceitam outras funções como parâmetro ou que retornam uma função
  * Closures: evita o uso de variáves globais 
* Evitar uso de classes no React (Recompose é indicado para isso)
* Escrita de algoritmos de maneira funcional (no JS, bibliotecas como o Ramda ajudam nisso)
* Referências de conceitos básicos de programação funcional
  * https://www.google.com/url?q=https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536&sa=D&ust=1519241854578000&usg=AFQjCNE3y_3r6Z5PPQidxij_eUdDQJcOcA 
  * https://blog.taller.net.br/programacao-funcional-parte1/ 
  * https://blog.taller.net.br/programacao-funcional-parte-2/