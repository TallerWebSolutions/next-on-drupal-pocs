# Qualidade de código

* Ferramentas para identificação de fuga aos padrões
  * [eslint-plugin](https://eslint.org/) para o projeto
  * linter-eslint para o editor (nome do pacote pode variar entre editores)
  * Exemplo de configuração para eslint (eslint-config-taller) 
  * editorconfig para o editor http://editorconfig.org/ 
  * Modelo do arquivo .editorconfig:

```
# More information at http://editorconfig.org/

root = true

[*]
charset                  = utf-8
end_of_line              = lf
indent_size              = 2
indent_style             = space
trim_trailing_whitespace = true

[*.php]
insert_final_newline = true
```

* Testes de código (unitário e snapshots de componentes do React) usando Jest
* Automatização das verificações via [git-hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) ([Husky](HUSKY.md))
* Automatização das verificações em esteiras de build (comandos devem estar inseridos nos scripts de build do Jenkins ou outro sistema de integração)
