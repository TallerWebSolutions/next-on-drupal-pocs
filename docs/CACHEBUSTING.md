# Introdução ao _Cache Busting_

Quando um arquivo estático é armazenado em _cache_, ele pode permanecer por longos períodos de tempo antes que ele venha a expirar. Isso garante maior velocidade de carregamentom, contribuindo para melhora de performance e escalabilidade. No entanto, pode apresentar pontos negativos em alguns casos de atualização de _assets_ (arquivos estáticos como CSS, Scripts, Imagens, etc) em uma aplicação web. Uma vez que a versão do arquivo em _cache_ é armazenada nos navegadores dos visitantes, os usuáros podem não conseguir ver as novas alterações. Isso se deve ao fato de que o navegador do visitante armazenará uma cópia dos arquivos estáticos em _cache_, dado que ao comportamento padrão de uma aplicação web é fazer uso do cache do navegador, por questões de performance.

## O que é _Cache Busting_

O procedimento de _cache busting_ resolve o problema de cache do navegador utilizando um identificador, único e exclusivo, dos arquivos para informar ao navegador que uma versão atualizada está disponível. Deste modo, o navegador não recupera o arquivo antigo do _cache_, pois fará uma solicitação ao servidor para um novo arquivo, com o _hash id_ atualizado.

### Exemplo básico

![Cache Busting Example](assets/cache_busting.png)

## Porque utilizar _Cache Busting_

Essa técnica é muito útil pois permite que seus usuários recebam os arquivos mais recentes sem haver a necessidade de um _hard refresh_ (`Ctrl+Shift+R` ou `Ctrl+F5`) ou de limpar o cache do navegador. Desde modo, o uso do _cache busting_ é benéfico para que as últimas mudanças possam ser enviadas e estar disponíveis para todos em tempo real.

