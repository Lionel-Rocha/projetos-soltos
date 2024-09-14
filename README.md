# BlockBudget: LaChain

## Contrato
Escrito em [Solidity 0.8.19](https://docs.soliditylang.org/en/v0.8.19/), é um contrato simples no qual um usuário pode criar, pagar e ler um determinado orçamento. 

## Testes
O framework de teste Waffle, para contratos inteligentes Ethereum, construído sobre ethers.js, é projetado para se integrar perfeitamente com outras ferramentas e bibliotecas do ecossistema Ethereum. Sua integração nativa com a biblioteca ethers.js foi de vital importância em sua escolha, tendo em vista que o projeto já usa Hardhat no ambiente de desenvolvimento. Waffle possui sintaxe simples e próxima à linguagem natural, além de possuir menos dependências que outros frameworks (ao contrário do Hardhat).

1. Em caso de dúvidas, vá para a página de documentação do [Waffle](https://ethereum-waffle.readthedocs.io/en/latest/getting-started.html).
2. Na pasta raiz do projeto, instale as dependências com:
 ``npm install`` ou ``yarn install``
3. Rode os testes com ``npm test``

Se tudo ocorreu conforme esperado, os 8 testes irão passar.

### Casos de teste

1. Guarda de orçamentos no mapping
2. Pagamento de orçamentos (fluxo normal)
3. Pagamento de orçamentos (fluxo com exceção 1: valor incorreto)
4. Pagamento de orçamentos (fluxo com exceção 2: dono do orçamento tenta pagar)
5. Pagamento de orçamentos (fluxo com exceção 3: orçamento já está pago)
6. Retorno da quantidade de orçamentos existentes
7. Retorno dos orçamentos de um determinado endereço
8. Retorno de orçamento (fluxo com exceção 1: orçamento inexistente)
9. (implícito) Retorno de determinado orçamento

## Próximos passos

1. Auditoria de contrato
2. Melhoria da interface do dApp
