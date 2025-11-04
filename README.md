# 🚀 Sistema de Gerenciamento de Etapas de Manutenção

**AV2**

## ⚙️ Pré-requisitos

Para rodar este projeto, você precisará ter o seguinte instalado:

* **Node.js** (LTS recomendado)
* **npm**
* **Git**

---

## 🛠️ Como Executar o Projeto Localmente
Para logar:

| Nível | Usuário | Senha |
| :--- | :--- | :--- | :--- |
| **ADMINISTRADOR** | `ana` | `123` |
| **ENGENHEIRO** | `lari` | `123` |
| **OPERADOR** | `lukas` | `123456` |

## 🚀 Como Rodar o Projeto

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/Ane-Graciano/AV2.git
    ```
2.  Instale as dependências:
    ```bash
    npm i
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```


### rodar a api para melhor fluxo

1.  Abra outro cmd e instale:
    ```
    npm install -g json-server
    ```
2.  Inicie o servidor:
    ```bash
    json-server --watch db.json --port 3000
    ```


