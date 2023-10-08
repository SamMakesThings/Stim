exports.id = 350;
exports.ids = [350];
exports.modules = {

/***/ 1442:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 5672))

/***/ }),

/***/ 4386:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 8258))

/***/ }),

/***/ 5672:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ChatWindow: () => (/* binding */ ChatWindow)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/react-toastify.esm.mjs
var react_toastify_esm = __webpack_require__(4751);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/ReactToastify.css
var ReactToastify = __webpack_require__(5996);
// EXTERNAL MODULE: ./node_modules/ai/react/dist/index.mjs + 3 modules
var dist = __webpack_require__(8384);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(8038);
;// CONCATENATED MODULE: ./components/ChatMessageBubble.tsx

function ChatMessageBubble(props) {
    const colorClassName = props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
    const alignmentClassName = props.message.role === "user" ? "ml-auto" : "mr-auto";
    const prefix = props.message.role === "user" ? "\uD83E\uDDD1" : props.aiEmoji;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: `${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "mr-2",
                children: prefix
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "whitespace-pre-wrap flex flex-col",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        children: props.message.content
                    }),
                    props.sources && props.sources.length ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("code", {
                                className: "mt-4 mr-auto bg-slate-600 px-2 py-1 rounded",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                                    children: "\uD83D\uDD0D Sources:"
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("code", {
                                className: "mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs",
                                children: props.sources?.map((source, i)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "mt-2",
                                        children: [
                                            i + 1,
                                            '. "',
                                            source.pageContent,
                                            '"',
                                            source.metadata?.loc?.lines !== undefined ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                                                    "Lines ",
                                                    source.metadata?.loc?.lines?.from,
                                                    " to ",
                                                    source.metadata?.loc?.lines?.to
                                                ]
                                            }) : ""
                                        ]
                                    }, "source:" + i))
                            })
                        ]
                    }) : ""
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./data/DefaultRetrievalText.ts
/* harmony default export */ const DefaultRetrievalText = (`# QA and Chat over Documents

Chat and Question-Answering (QA) over \`data\` are popular LLM use-cases.

\`data\` can include many things, including:

* \`Unstructured data\` (e.g., PDFs)
* \`Structured data\` (e.g., SQL)
* \`Code\` (e.g., Python)

Below we will review Chat and QA on \`Unstructured data\`.

![intro.png](/img/qa_intro.png)

\`Unstructured data\` can be loaded from many sources.

Check out the [document loader integrations here](/docs/modules/data_connection/document_loaders/) to browse the set of supported loaders.

Each loader returns data as a LangChain \`Document\`.

\`Documents\` are turned into a Chat or QA app following the general steps below:

* \`Splitting\`: [Text splitters](/docs/modules/data_connection/document_transformers/) break \`Documents\` into splits of specified size
* \`Storage\`: Storage (e.g., often a [vectorstore](/docs/modules/data_connection/vectorstores/)) will house [and often embed](https://www.pinecone.io/learn/vector-embeddings/) the splits
* \`Retrieval\`: The app retrieves splits from storage (e.g., often [with similar embeddings](https://www.pinecone.io/learn/k-nearest-neighbor/) to the input question)
* \`Output\`: An [LLM](/docs/modules/model_io/models/llms/) produces an answer using a prompt that includes the question and the retrieved splits

![flow.jpeg](/img/qa_flow.jpeg)

## Quickstart

Let's load this [blog post](https://lilianweng.github.io/posts/2023-06-23-agent/) on agents as an example \`Document\`.

We'll have a QA app in a few lines of code.

First, set environment variables and install packages required for the guide:

\`\`\`shell
> yarn add cheerio
# Or load env vars in your preferred way:
> export OPENAI_API_KEY="..."
\`\`\`

## 1. Loading, Splitting, Storage

### 1.1 Getting started

Specify a \`Document\` loader.

\`\`\`typescript
// Document loader
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/"
);
const data = await loader.load();
\`\`\`

Split the \`Document\` into chunks for embedding and vector storage.


\`\`\`typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});

const splitDocs = await textSplitter.splitDocuments(data);
\`\`\`

Embed and store the splits in a vector database (for demo purposes we use an unoptimized, in-memory example but you can [browse integrations here](/docs/modules/data_connection/vectorstores/integrations/)):


\`\`\`typescript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
\`\`\`

Here are the three pieces together:

![lc.png](/img/qa_data_load.png)

### 1.2 Going Deeper

#### 1.2.1 Integrations

\`Document Loaders\`

* Browse document loader integrations [here](/docs/modules/data_connection/document_loaders/).

* See further documentation on loaders [here](/docs/modules/data_connection/document_loaders/).

\`Document Transformers\`

* All can ingest loaded \`Documents\` and process them (e.g., split).

* See further documentation on transformers [here](/docs/modules/data_connection/document_transformers/).

\`Vectorstores\`

* Browse vectorstore integrations [here](/docs/modules/data_connection/vectorstores/integrations/).

* See further documentation on vectorstores [here](/docs/modules/data_connection/vectorstores/).

## 2. Retrieval

### 2.1 Getting started

Retrieve [relevant splits](https://www.pinecone.io/learn/what-is-similarity-search/) for any question using \`similarity_search\`.


\`\`\`typescript
const relevantDocs = await vectorStore.similaritySearch("What is task decomposition?");

console.log(relevantDocs.length);

// 4
\`\`\`


### 2.2 Going Deeper

#### 2.2.1 Retrieval

Vectorstores are commonly used for retrieval.

But, they are not the only option.

For example, SVMs (see thread [here](https://twitter.com/karpathy/status/1647025230546886658?s=20)) can also be used.

LangChain [has many retrievers and retrieval methods](/docs/modules/data_connection/retrievers/) including, but not limited to, vectorstores.

All retrievers implement some common methods, such as \`getRelevantDocuments()\`.


## 3. QA

### 3.1 Getting started

Distill the retrieved documents into an answer using an LLM (e.g., \`gpt-3.5-turbo\`) with \`RetrievalQA\` chain.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever());

const response = await chain.call({
  query: "What is task decomposition?"
});
console.log(response);

/*
  {
    text: 'Task decomposition refers to the process of breaking down a larger task into smaller, more manageable subgoals. By decomposing a task, it becomes easier for an agent or system to handle complex tasks efficiently. Task decomposition can be done through various methods such as using prompting or task-specific instructions, or through human inputs. It helps in planning and organizing the steps required to complete a task effectively.'
  }
*/
\`\`\`

### 3.2 Going Deeper

#### 3.2.1 Integrations

\`LLMs\`

* Browse LLM integrations and further documentation [here](/docs/modules/model_io/models/).

#### 3.2.2 Customizing the prompt

The prompt in \`RetrievalQA\` chain can be customized as follows.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

const template = \`Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.
{context}
Question: {question}
Helpful Answer:\`;

const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  prompt: PromptTemplate.fromTemplate(template),
});

const response = await chain.call({
  query: "What is task decomposition?"
});

console.log(response);

/*
  {
    text: 'Task decomposition is the process of breaking down a large task into smaller, more manageable subgoals. This allows for efficient handling of complex tasks and aids in planning and organizing the steps needed to achieve the overall goal. Thanks for asking!'
  }
*/
\`\`\`


#### 3.2.3 Returning source documents

The full set of retrieved documents used for answer distillation can be returned using \`return_source_documents=True\`.


\`\`\`typescript
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  returnSourceDocuments: true
});

const response = await chain.call({
  query: "What is task decomposition?"
});

console.log(response.sourceDocuments[0]);

/*
Document {
  pageContent: 'Task decomposition can be done (1) by LLM with simple prompting like "Steps for XYZ.\\n1.", "What are the subgoals for achieving XYZ?", (2) by using task-specific instructions; e.g. "Write a story outline." for writing a novel, or (3) with human inputs.',
  metadata: [Object]
}
*/
\`\`\`


#### 3.2.4 Customizing retrieved docs in the LLM prompt

Retrieved documents can be fed to an LLM for answer distillation in a few different ways.

\`stuff\`, \`refine\`, and \`map-reduce\` chains for passing documents to an LLM prompt are well summarized [here](/docs/modules/chains/document/).

\`stuff\` is commonly used because it simply "stuffs" all retrieved documents into the prompt.

The [loadQAChain](/docs/modules/chains/document/) methods are easy ways to pass documents to an LLM using these various approaches.


\`\`\`typescript
import { loadQAStuffChain } from "langchain/chains";

const stuffChain = loadQAStuffChain(model);

const stuffResult = await stuffChain.call({
  input_documents: relevantDocs,
  question: "What is task decomposition
});

console.log(stuffResult);
/*
{
  text: 'Task decomposition is the process of breaking down a large task into smaller, more manageable subgoals or steps. This allows for efficient handling of complex tasks by focusing on one subgoal at a time. Task decomposition can be done through various methods such as using simple prompting, task-specific instructions, or human inputs.'
}
*/
\`\`\`

## 4. Chat

### 4.1 Getting started

To keep chat history, we use a variant of the previous chain called a \`ConversationalRetrievalQAChain\`.
First, specify a \`Memory buffer\` to track the conversation inputs / outputs.


\`\`\`typescript
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
});
\`\`\`

Next, we initialize and call the chain:

\`\`\`typescript
const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
  memory
});

const result = await chain.call({
  question: "What are some of the main ideas in self-reflection?"
});
console.log(result);

/*
{
  text: 'Some main ideas in self-reflection include:\n' +
    '\n' +
    '1. Iterative Improvement: Self-reflection allows autonomous agents to improve by continuously refining past action decisions and correcting mistakes.\n' +
    '\n' +
    '2. Trial and Error: Self-reflection plays a crucial role in real-world tasks where trial and error are inevitable. It helps agents learn from failed trajectories and make adjustments for future actions.\n' +
    '\n' +
    '3. Constructive Criticism: Agents engage in constructive self-criticism of their big-picture behavior to identify areas for improvement.\n' +
    '\n' +
    '4. Decision and Strategy Refinement: Reflection on past decisions and strategies enables agents to refine their approach and make more informed choices.\n' +
    '\n' +
    '5. Efficiency and Optimization: Self-reflection encourages agents to be smart and efficient in their actions, aiming to complete tasks in the least number of steps.\n' +
    '\n' +
    'These ideas highlight the importance of self-reflection in enhancing performance and guiding future actions.'
}
*/
\`\`\`


The \`Memory buffer\` has context to resolve \`"it"\` ("self-reflection") in the below question.


\`\`\`typescript
const followupResult = await chain.call({
  question: "How does the Reflexion paper handle it?"
});
console.log(followupResult);

/*
{
  text: "The Reflexion paper introduces a framework that equips agents with dynamic memory and self-reflection capabilities to improve their reasoning skills. The approach involves showing the agent two-shot examples, where each example consists of a failed trajectory and an ideal reflection on how to guide future changes in the agent's plan. These reflections are then added to the agent's working memory as context for querying a language model. The agent uses this self-reflection information to make decisions on whether to start a new trial or continue with the current plan."
}
*/
\`\`\`


### 4.2 Going deeper

The [documentation](/docs/modules/chains/popular/chat_vector_db) on \`ConversationalRetrievalQAChain\` offers a few extensions, such as streaming and source documents.


# Conversational Retrieval Agents

This is an agent specifically optimized for doing retrieval when necessary while holding a conversation and being able
to answer questions based on previous dialogue in the conversation.

To start, we will set up the retriever we want to use, then turn it into a retriever tool. Next, we will use the high-level constructor for this type of agent.
Finally, we will walk through how to construct a conversational retrieval agent from components.

## The Retriever

To start, we need a retriever to use! The code here is mostly just example code. Feel free to use your own retriever and skip to the next section on creating a retriever tool.

\`\`\`typescript
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const loader = new TextLoader("state_of_the_union.txt");
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0
});

const texts = await splitter.splitDocuments(docs);

const vectorStore = await FaissStore.fromDocuments(texts, new OpenAIEmbeddings());

const retriever = vectorStore.asRetriever();
\`\`\`

## Retriever Tool

Now we need to create a tool for our retriever. The main things we need to pass in are a \`name\` for the retriever as well as a \`description\`. These will both be used by the language model, so they should be informative.

\`\`\`typescript
import { createRetrieverTool } from "langchain/agents/toolkits";

const tool = createRetrieverTool(retriever, {
  name: "search_state_of_union",
  description: "Searches and returns documents regarding the state-of-the-union.",
});
\`\`\`

## Agent Constructor

Here, we will use the high level \`create_conversational_retrieval_agent\` API to construct the agent.
Notice that beside the list of tools, the only thing we need to pass in is a language model to use.

Under the hood, this agent is using the OpenAIFunctionsAgent, so we need to use an ChatOpenAI model.

\`\`\`typescript
import { createConversationalRetrievalAgent } from "langchain/agents/toolkits";
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({
  temperature: 0,
});

const executor = await createConversationalRetrievalAgent(model, [tool], {
  verbose: true,
});
\`\`\`

We can now try it out!

\`\`\`typescript
const result = await executor.call({
  input: "Hi, I'm Bob!"
});

console.log(result);

/*
  {
    output: 'Hello Bob! How can I assist you today?',
    intermediateSteps: []
  }
*/

const result2 = await executor.call({
  input: "What's my name?"
});

console.log(result2);

/*
  { output: 'Your name is Bob.', intermediateSteps: [] }
*/

const result3 = await executor.call({
  input: "What did the president say about Ketanji Brown Jackson in the most recent state of the union?"
});

console.log(result3);

/*
  {
    output: "In the most recent state of the union, President Biden mentioned Ketanji Brown Jackson. He nominated her as a Circuit Court of Appeals judge and described her as one of the nation's top legal minds who will continue Justice Breyer's legacy of excellence. He mentioned that she has received a broad range of support, including from the Fraternal Order of Police and former judges appointed by Democrats and Republicans.",
    intermediateSteps: [
      {...}
    ]
  }
*/

const result4 = await executor.call({
  input: "How long ago did he nominate her?"
});

console.log(result4);

/*
  {
    output: 'President Biden nominated Ketanji Brown Jackson four days before the most recent state of the union address.',
    intermediateSteps: []
  }
*/
\`\`\`

Note that for the final call, the agent used previously retrieved information to answer the query and did not need to call the tool again!

Here's a trace showing how the agent fetches documents to answer the question with the retrieval tool:

https://smith.langchain.com/public/1e2b1887-ca44-4210-913b-a69c1b8a8e7e/r

## Creating from components

What actually is going on underneath the hood? Let's take a look so we can understand how to modify things going forward.

### Memory

In this example, we want the agent to remember not only previous conversations, but also previous intermediate steps.
For that, we can use \`OpenAIAgentTokenBufferMemory\`. Note that if you want to change whether the agent remembers intermediate steps,
how the long the retained buffer is, or anything like that you should change this part.

\`\`\`typescript
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";

const memory = new OpenAIAgentTokenBufferMemory({
  llm: model,
  memoryKey: "chat_history",
  outputKey: "output"
});
\`\`\`

You should make sure \`memoryKey\` is set to \`"chat_history"\` and \`outputKey\` is set to \`"output"\` for the OpenAI functions agent.
This memory also has \`returnMessages\` set to \`true\` by default.

You can also load messages from prior conversations into this memory by initializing it with a pre-loaded chat history:

\`\`\`typescript
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { HumanMessage, AIMessage } from "langchain/schema";
import { ChatMessageHistory } from "langchain/memory";

const previousMessages = [
  new HumanMessage("My name is Bob"),
  new AIMessage("Nice to meet you, Bob!"),
];

const chatHistory = new ChatMessageHistory(previousMessages);

const memory = new OpenAIAgentTokenBufferMemory({
  llm: new ChatOpenAI({}),
  memoryKey: "chat_history",
  outputKey: "output",
  chatHistory,
});
\`\`\`

### Agent executor

We can recreate the agent executor directly with the \`initializeAgentExecutorWithOptions\` method.
This allows us to customize the agent's system message by passing in a \`prefix\` into \`agentArgs\`.
Importantly, we must pass in \`return_intermediate_steps: true\` since we are recording that with our memory object.

\`\`\`typescript
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: "openai-functions",
  memory,
  returnIntermediateSteps: true,
  agentArgs: {
    prefix:
      prefix ??
      \`Do your best to answer the questions. Feel free to use any tools available to look up relevant information, only if necessary.\`,
  },
});
\`\`\`
`);

;// CONCATENATED MODULE: ./components/UploadDocumentsForm.tsx
/* __next_internal_client_entry_do_not_use__ UploadDocumentsForm auto */ 


function UploadDocumentsForm() {
    const [isLoading, setIsLoading] = (0,react_.useState)(false);
    const [document, setDocument] = (0,react_.useState)(DefaultRetrievalText);
    const ingest = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch("/api/retrieval/ingest", {
            method: "POST",
            body: JSON.stringify({
                text: document
            })
        });
        if (response.status === 200) {
            setDocument("Uploaded!");
        } else {
            const json = await response.json();
            if (json.error) {
                setDocument(json.error);
            }
        }
        setIsLoading(false);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
        onSubmit: ingest,
        className: "flex w-full mb-4",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                className: "grow mr-8 p-4 rounded",
                value: document,
                onChange: (e)=>setDocument(e.target.value)
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                type: "submit",
                className: "shrink-0 px-8 py-4 bg-sky-600 rounded w-28",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        role: "status",
                        className: `${isLoading ? "" : "hidden"} flex justify-center`,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                "aria-hidden": "true",
                                className: "w-6 h-6 text-white animate-spin dark:text-white fill-sky-800",
                                viewBox: "0 0 100 101",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                        d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
                                        fill: "currentColor"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                        d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
                                        fill: "currentFill"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                className: "sr-only",
                                children: "Loading..."
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: isLoading ? "hidden" : "",
                        children: "Upload"
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./components/IntermediateStep.tsx


function IntermediateStep(props) {
    const parsedInput = JSON.parse(props.message.content);
    const action = parsedInput.action;
    const observation = parsedInput.observation;
    const [expanded, setExpanded] = (0,react_.useState)(false);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: `ml-auto bg-green-600 rounded px-4 py-2 max-w-[80%] mb-8 whitespace-pre-wrap flex flex-col cursor-pointer`,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `text-right ${expanded ? "w-full" : ""}`,
                onClick: (e)=>setExpanded(!expanded),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("code", {
                        className: "mr-2 bg-slate-600 px-2 py-1 rounded hover:text-blue-600",
                        children: [
                            "\uD83D\uDEE0️ ",
                            /*#__PURE__*/ jsx_runtime_.jsx("b", {
                                children: action.tool
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: expanded ? "hidden" : "",
                        children: "\uD83D\uDD3D"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: expanded ? "" : "hidden",
                        children: "\uD83D\uDD3C"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `overflow-hidden max-h-[0px] transition-[max-height] ease-in-out ${expanded ? "max-h-[360px]" : ""}`,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `bg-slate-600 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`,
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("code", {
                            className: `opacity-0 max-h-[100px] overflow-auto transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`,
                            children: [
                                "Tool Input:",
                                /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                                /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                                JSON.stringify(action.toolInput)
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `bg-slate-600 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx("code", {
                            className: `opacity-0 max-h-[260px] overflow-auto transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`,
                            children: observation
                        })
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./components/ChatWindow.tsx
/* __next_internal_client_entry_do_not_use__ ChatWindow auto */ 







function ChatWindow(props) {
    const messageContainerRef = (0,react_.useRef)(null);
    const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji } = props;
    const [showIntermediateSteps, setShowIntermediateSteps] = (0,react_.useState)(false);
    const [intermediateStepsLoading, setIntermediateStepsLoading] = (0,react_.useState)(false);
    const ingestForm = showIngestForm && /*#__PURE__*/ jsx_runtime_.jsx(UploadDocumentsForm, {});
    const intemediateStepsToggle = showIntermediateStepsToggle && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                type: "checkbox",
                id: "show_intermediate_steps",
                name: "show_intermediate_steps",
                checked: showIntermediateSteps,
                onChange: (e)=>setShowIntermediateSteps(e.target.checked)
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("label", {
                htmlFor: "show_intermediate_steps",
                children: " Show intermediate steps"
            })
        ]
    });
    const [sourcesForMessages, setSourcesForMessages] = (0,react_.useState)({});
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } = (0,dist/* useChat */.R)({
        api: endpoint,
        onResponse (response) {
            const sourcesHeader = response.headers.get("x-sources");
            const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
            const messageIndexHeader = response.headers.get("x-message-index");
            if (sources.length && messageIndexHeader !== null) {
                setSourcesForMessages({
                    ...sourcesForMessages,
                    [messageIndexHeader]: sources
                });
            }
        },
        onError: (e)=>{
            (0,react_toastify_esm/* toast */.Am)(e.message, {
                theme: "dark"
            });
        }
    });
    async function sendMessage(e) {
        e.preventDefault();
        if (messageContainerRef.current) {
            messageContainerRef.current.classList.add("grow");
        }
        if (!messages.length) {
            await new Promise((resolve)=>setTimeout(resolve, 300));
        }
        if (chatEndpointIsLoading ?? intermediateStepsLoading) {
            return;
        }
        if (!showIntermediateSteps) {
            handleSubmit(e);
        // Some extra work to show intermediate steps properly
        } else {
            setIntermediateStepsLoading(true);
            setInput("");
            const messagesWithUserReply = messages.concat({
                id: messages.length.toString(),
                content: input,
                role: "user"
            });
            setMessages(messagesWithUserReply);
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({
                    messages: messagesWithUserReply,
                    show_intermediate_steps: true
                })
            });
            const json = await response.json();
            setIntermediateStepsLoading(false);
            if (response.status === 200) {
                // Represent intermediate steps as system messages for display purposes
                const intermediateStepMessages = (json.intermediate_steps ?? []).map((intermediateStep, i)=>{
                    return {
                        id: (messagesWithUserReply.length + i).toString(),
                        content: JSON.stringify(intermediateStep),
                        role: "system"
                    };
                });
                const newMessages = messagesWithUserReply;
                for (const message of intermediateStepMessages){
                    newMessages.push(message);
                    setMessages([
                        ...newMessages
                    ]);
                    await new Promise((resolve)=>setTimeout(resolve, 1000 + Math.random() * 1000));
                }
                setMessages([
                    ...newMessages,
                    {
                        id: (newMessages.length + intermediateStepMessages.length).toString(),
                        content: json.output,
                        role: "assistant"
                    }
                ]);
            } else {
                if (json.error) {
                    (0,react_toastify_esm/* toast */.Am)(json.error, {
                        theme: "dark"
                    });
                    throw new Error(json.error);
                }
            }
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: `flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${messages.length > 0 ? "border" : ""}`,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("h2", {
                className: `${messages.length > 0 ? "" : "hidden"} text-2xl`,
                children: [
                    emoji,
                    " ",
                    titleText
                ]
            }),
            messages.length === 0 ? emptyStateComponent : "",
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out",
                ref: messageContainerRef,
                children: messages.length > 0 ? [
                    ...messages
                ].reverse().map((m, i)=>{
                    const sourceKey = (messages.length - 1 - i).toString();
                    return m.role === "system" ? /*#__PURE__*/ jsx_runtime_.jsx(IntermediateStep, {
                        message: m
                    }, m.id) : /*#__PURE__*/ jsx_runtime_.jsx(ChatMessageBubble, {
                        message: m,
                        aiEmoji: emoji,
                        sources: sourcesForMessages[sourceKey]
                    }, m.id);
                }) : ""
            }),
            messages.length === 0 && ingestForm,
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                onSubmit: sendMessage,
                className: "flex w-full flex-col",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "flex",
                        children: intemediateStepsToggle
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex w-full mt-4",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                className: "grow mr-8 p-4 rounded",
                                value: input,
                                placeholder: placeholder ?? "What's it like to be a pirate?",
                                onChange: handleInputChange
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                type: "submit",
                                className: "shrink-0 px-8 py-4 bg-sky-600 rounded w-28",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        role: "status",
                                        className: `${chatEndpointIsLoading || intermediateStepsLoading ? "" : "hidden"} flex justify-center`,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                                "aria-hidden": "true",
                                                className: "w-6 h-6 text-white animate-spin dark:text-white fill-sky-800",
                                                viewBox: "0 0 100 101",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg",
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                        d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
                                                        fill: "currentColor"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                        d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
                                                        fill: "currentFill"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                className: "sr-only",
                                                children: "Loading..."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        className: chatEndpointIsLoading || intermediateStepsLoading ? "hidden" : "",
                                        children: "Send"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(react_toastify_esm/* ToastContainer */.Ix, {})
        ]
    });
}


/***/ }),

/***/ 8258:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Navbar: () => (/* binding */ Navbar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ Navbar auto */ 

function Navbar() {
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_1__.usePathname)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
        className: "mb-4",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                className: `mr-4 ${pathname === "/" ? "text-white border-b" : ""}`,
                href: "/",
                children: "\uD83C\uDFF4‍☠️ Chat"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                className: `mr-4 ${pathname === "/structured_output" ? "text-white border-b" : ""}`,
                href: "/structured_output",
                children: "\uD83E\uDDF1 Structured Output"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                className: `mr-4 ${pathname === "/agents" ? "text-white border-b" : ""}`,
                href: "/agents",
                children: "\uD83E\uDD9C Agents"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                className: `mr-4 ${pathname === "/retrieval" ? "text-white border-b" : ""}`,
                href: "/retrieval",
                children: "\uD83D\uDC36 Retrieval"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                className: `mr-4 ${pathname === "/retrieval_agents" ? "text-white border-b" : ""}`,
                href: "/retrieval_agents",
                children: "\uD83E\uDD16 Retrieval Agents"
            })
        ]
    });
}


/***/ }),

/***/ 6095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app/layout.tsx","import":"Public_Sans","arguments":[{"subsets":["latin"]}],"variableName":"publicSans"}
var layout_tsx_import_Public_Sans_arguments_subsets_latin_variableName_publicSans_ = __webpack_require__(7120);
var layout_tsx_import_Public_Sans_arguments_subsets_latin_variableName_publicSans_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Public_Sans_arguments_subsets_latin_variableName_publicSans_);
// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(7272);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(1363);
;// CONCATENATED MODULE: ./components/Navbar.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/merlimar/Projects/AUTOGPT/BBB/Stim/ui/components/Navbar.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["Navbar"];

;// CONCATENATED MODULE: ./app/layout.tsx




function RootLayout({ children }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("html", {
        lang: "en",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("head", {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("title", {
                        children: "LangChain + Next.js Template"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("link", {
                        rel: "shortcut icon",
                        href: "/images/favicon.ico"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "description",
                        content: "Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        property: "og:title",
                        content: "LangChain + Next.js Template"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        property: "og:description",
                        content: "Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        property: "og:image",
                        content: "/images/og-image.png"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "twitter:title",
                        content: "LangChain + Next.js Template"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "twitter:description",
                        content: "Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "twitter:image",
                        content: "/images/og-image.png"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("body", {
                className: (layout_tsx_import_Public_Sans_arguments_subsets_latin_variableName_publicSans_default()).className,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-col p-4 md:p-12 h-[100vh]",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(e0, {}),
                        children
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 8056:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ e0)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1363);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/Users/merlimar/Projects/AUTOGPT/BBB/Stim/ui/components/ChatWindow.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["ChatWindow"];


/***/ }),

/***/ 7272:
/***/ (() => {



/***/ })

};
;