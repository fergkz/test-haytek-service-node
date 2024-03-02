# Separação de pedidos em lotes - API NodeJS + NestJS

![GitHub repo size](https://img.shields.io/github/repo-size/fergkz/test-haytek-service-node?style=for-the-badge&c=1)
![GitHub language count](https://img.shields.io/github/languages/count/fergkz/test-haytek-service-node?style=for-the-badge&c=1)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![](https://img.shields.io/badge/GitKraken-179287?style=for-the-badge&logo=GitKraken&logoColor=white)
![](https://img.shields.io/badge/Google_chrome-4285F4?style=for-the-badge&logo=Google-chrome&logoColor=white)

Microserviço em forma de API para efetuar a separação de de pedidos em lotes, otimizando a utilização de caixas agrupadas por transportadora e cliente.

[Descrição, regras de negócio e referências](https://github.com/haytek-project/test-haytek/blob/main/README.md)


## Instalação e execução do sistema

### Sistema Operacional

> [!NOTE] 
> A instalação e execução deve ser efetuada em um sistema operacional linux Ubuntu. Caso contrário, os comandos abaixo devem ser adequados para o seu sistema operacional.

- Ubuntu 18.04.6 - Ram 1GB - 1 core CPU

### Linguagens / Tecnologias

- NodeJS v18.18.2
- NPM v9.8.1
- VSCode
- Git / Gitbash / GitKraken
- Github

### Preparação do Ambiente

Certifique-se de ter privilégios de superusuário ou utilize `sudo` para executar os comandos.

Baixe o projeto para o seu computador. Pode ser pelo git mesmo, mas indico baixar o ZIP e extrair daqui se você não for contribuir com a evolução do projeto e necessitar apenas avaliar.

#### 1. Atualização do Sistema

```
sudo apt-get update && sudo apt-get upgrade
```

#### 2. ### Instalação do CLI nest
    
Siga as orientações em https://docs.nestjs.com/fist-steps

#### 3. Instalar o AXIOS

*O `axios` é utilizado para chamadas de requisições HTTP. Vide instalação e utilização em https://docs.nestjs.com/techniques/http-module.*

```
npm i --save @nestjs/axios axios
```

#### 4. Instalar o moment

*A biblioteca `moment` vai nos auxiliar a converter o tipo de data recebida para o correto*

```
npm install moment
```

#### 5. Criando um proxy reverso

*Precisamos criar um proxy reverso para não haver problemas com CORS nas requisições em tela*

```
npm install http-proxy-middleware
```

### Rodando a Aplicação

Vá até o diretório do projeto baixado e execute:

```
$ npm run start:debug
```

## Versão 1.0

#### Regras Funcionais
- R1. Pedidos enviados dentro de uma mesma data para um mesmo endereço devem ser agrupados em entregas.
- R2. Uma mesma entrega pode conter mais de uma caixa.
- R3. Os pedidos só podem ser agrupados, se forem enviados pela mesma transportadora
- R4. Cada transportadora tem um horário de corte. Pedidos realizados antes do horário de corte, são enviados no mesmo dia.
- R5. Cada transportadora tem um horário de corte. Pedidos realizados após o horário de corte, são enviados no dia seguinte.
- R6. As entregas devem ser agrupados no menor número de caixas possível.
- R7. Usar sempre a menor caixa disponível.
    - R7.1. Pode conflitar com a regra R6.

        Exemplo:
        > Caixa P = 5 itens, Caixa M = 10 itens, Caixa G = 30 itens.<br/>
        > Separação de 11 itens.
        > 
        > Pela regra R6 devemos utilizar a caixa G, pois gera uma menor quantidade de caixas, então, não podemos utilizar a menor caixa disponível pois necessitaria de 2 caixa (P+M).


- R8. A Soma da quantidade máxima de itens das caixas de uma mesma entrega deve ser a menor possível.

    - R8.1. Pode conflitar com a regra R6.

        Exemplo:
        > Caixa P = 5 itens, Caixa M = 10 itens, Caixa G = 30 itens.<br/>
        > Separação de 11 itens.
        > 
        > Pela regra R6 devemos utilizar a caixa G, pois gera uma menor quantidade de caixas, mas gera um volume máximo total de itens = 30.<br/>
        > Para obter a menor soma da capacidade das caixas precisaríamos de uma caixa M e uma P, somando um total de 15 em capacidade.
        > 
        > Então utilizando duas caixas (P+M = 15) temos uma soma de capacidade menor que utilizando apenas uma caixa (G = 30), porém, como a R6 precede a esta, devemos considerar primeiro a R6.

- R9. O mesmo pedido pode ser quebrado em mais de uma caixa, se preciso

#### Requisitos Obrigatórios

- [x] Documentação de como configurar o ambiente e rodar a aplicação no computador do avaliador
- [x] Boas práticas de programação
- [x] Código fácil de entender e manter

#### Adições
- [x] Microserviço Hexagonal
- [x] Proxy reverso de APIs externas para acesso local no frontend
- [x] Documentação da API com swagger
- [x] Inversão de dependências
- [x] Injeção de dependências

#### Pontos de Atenção
- O sistema não está levando em consideração o volume dos itens
- O sistema não está levando em consideração a capacidade de carga de cada caminhão
- O sistema não possui informações de itens individuais, portanto, não é possível gerar etiquetas isoladas por pacote

#### Observações
- Não se fez necessário a utilização de banco de dados

#### Próximos Passos (versão 1.1+)

- [ ] Consolidar dados externos em banco de dados local
- [ ] Adicionar cache nas requisições externas
- [ ] Efetuar chamadas assíncronas nas APIs externas
- [ ] Adicionar indicadores de desempenho da aplicação
- [ ] Tratar itens individualmente com suas propriedades
- [ ] Adicionar sistema de geração de etiquetas
- [ ] Alterar atributos para público nas entidades
- [ ] Adicionar autenticação de acesso
- [ ] Adicionar limitadores nas APIs externas e internas
- [ ] Adicionar filtros nas APIs externas e internas
- [ ] Compatibilizar a containerização por Docker