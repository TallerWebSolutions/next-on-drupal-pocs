# Introdução ao _Cache Busting_

Quando um arquivo estático é armazenado em _cache_, ele pode permanecer por longos períodos de tempo antes que ele venha a expirar. Isso garante maior velocidade de carregamento. No entanto, pode apresentar pontos negativos em alguns casos de atualização em uma aplicação web, uma vez que a versão do arquivo em _cache_ é armazenada nos navegadores dos visitantes, os usuáros podem não conseguir ver as novas alterações. Isso se deve ao fato de que o navegador de um visitante armazenará localmente uma cópia de seus arquivos estáticos em _cache_, dado que a aplicação web esteja configurada para fazer uso do cache do navegador.

O procedimento de _cache busting_ resolve o problema de cache do navegador usando um identificador de versão de arquivo exclusivo para informar ao navegador que uma nova versão do arquivo está disponível. Deste modo, o navegador não recupera o arquivo antigo do _cache_, pois faz uma solicitação ao servidor de origem para o novo arquivo.

![Cache Busting Example](assets/cache_busting.png)

Essa técnica é muito útil porque permite que seus usuários recebam os arquivos mais recentes sem ter a necessidade de um _hard refresh_ ou de limpar o cache do navegador. Do ponto de vista de desenvolvimento, o uso do _cache busting_ é benéfico para que as últimas mudanças possam ser enviadas e disponíveis para todos imediatamente.
