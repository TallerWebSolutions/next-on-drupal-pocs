# Preferência ao paradigma de programação funcional

* O paradigma funcional facilita a escrita de códigos modulares, desacoplados, facilmente testáveis, sem efeitos colaterais e de fácil manutenção. Algumas técnicas básicas podem ajudar a cumprir estes objetivos:
  * Funções puras: são funções que operam apenas com seus parâmetros
  * Imutabilidade: preferencia por constantes, tratar variaveis como valores imutáveis. Em Javascript, isso pode ser uma tarefa difícil, e existem algumas bibliotecas que ajudam nesse processo ([Immutable](https://facebook.github.io/immutable-js/))
  * Uso de recursões ao invés de loops, o que auxilia na conquista da imutabilidade
  * Higher-order-functions: são funções que aceitam outras funções como parâmetro ou que retornam uma função
  * Closures: evita o uso de variáves globais
* Evitar uso de classes no React (Recompose é indicado para isso)
* Escrita de algoritmos de maneira funcional (no JS, bibliotecas como o Ramda ajudam nisso)
* Referências de conceitos básicos de programação funcional
  * https://www.google.com/url?q=https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536&sa=D&ust=1519241854578000&usg=AFQjCNE3y_3r6Z5PPQidxij_eUdDQJcOcA
  * https://blog.taller.net.br/programacao-funcional-parte1/
  * https://blog.taller.net.br/programacao-funcional-parte-2/

## Exemplo demostrando um pouco a vantagem de se escrever código funcional e também a implementação do Ramda.

```

const data = [
  { gender: 'male', name: 'John', age: 28 },
  { gender: 'male', name: 'Tomas', age: 53 },
  { gender: 'female', name: 'Jessica', age: 44 },
  { gender: 'male', name: 'Tom', age: 15 },
  { gender: 'female', name: 'Kat', age: 36 },
]

// Imperative.
const getMaleOrderedByAge_Imperative = people => {
  const males = []

  for (let i in people) {
    if (people[i].gender === 'male') {
      males.push(people[i])
    }
  }

  // Ok, this is just an exemple... no one implements sorting algorithms anymore.
  for (let i = males.length - 1; i >= 0; i--) {
    for (var j = 1; j <= i; j++){
      if (males[j - 1].age > males[j].age) {
        var temp = males[j - 1];
        males[j - 1] = males[j];
        males[j] = temp;
      }
    }
  }

  return males
}

// Functional using JavaScript prototype.
const getMaleOrderedByAge_Prototype = people => people
  .filter(({ gender }) => gender === 'male')
  .sort((a, b) => a.age > b.age ? 1 : -1)

// Functional using Ramda.
const getMaleOrderedByAge_Ramda = R.pipe(
  R.filter(R.propEq('gender', 'male')),
  R.sortBy(R.prop('age'))
)

getMaleOrderedByAge_Ramda(data)
```
