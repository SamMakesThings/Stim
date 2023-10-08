# import os
# from dotenv import load_dotenv

# # Import all the langchain bullshit
# from langchain.agents import load_tools
# from langchain.agents import ZeroShotAgent, AgentExecutor
# from langchain.tools import Tool
# from langchain.chains import LLMChain
# from langchain.chat_models import ChatOpenAI

# load_dotenv()

# llm = ChatOpenAI(
#     model_name="gpt-4",
#     temperature=0,
#     openai_api_key=os.environ["OPENAI_API_KEY"],
# )

# tools = load_tools(["wikipedia"], llm=llm)

# # TODO: Write tools. Should mostly be wrappers of existing functions.
# # Tools needed:
# # Insert context into conversation
# # Remove batched info from topics (if already sent to user)
# # Add the above as step creation things?
# # TODO: Tool descriptions should include info on when something should
# # ...be surfaced to a user

# # define
# contextualize_topic_batches_tool = Tool  # @Agus what does this do?


# # tools.append(query_menoresources_tool)
# tool_names = [tool.name for tool in tools]

# prefix = """You are a generally capable agent whose specialty
# is juggling multiple priorities. Your job is to take in info
# from multiple sources, then decide how to act on that info."""

# format_instructions = """Use the following format:

# Question: the input question you must answer
# Thought: you should always think about what to do
# Action: the action to take, should be one of [query-menoresources, Wikipedia]. If you want to give a final answer, just use that, don't say Action: None
# Action Input: the input to the action
# Observation: the result of the action
# ... (this Thought/Action/Action Input/Observation can repeat N times)
# Thought: I now know the final answer
# Final Answer: the final answer to the original input question"""  # noqa: E501

# suffix = """Make sure you start every line with one of Thought:, Action:, Action Input:, Observation:, or Final Answer:.

# Topics to consider raising to the user:
# {batched_topics_str}

# Current conversation:
# {chat_history_str}

# """  # noqa: E501

# prompt = ZeroShotAgent.create_prompt(
#     tools,
#     prefix=prefix,
#     suffix=suffix,
#     format_instructions=format_instructions,
#     input_variables=[
#         "batched_topics_str",
#         "chat_history_str",
#     ],
# )

# llm_chain = LLMChain(
#     llm=llm,
#     prompt=prompt,
# )

# agent = ZeroShotAgent(
#     llm_chain=llm_chain,
#     allowed_tools=tool_names,
# )

# agent_executor = AgentExecutor.from_agent_and_tools(
#     agent=agent,
#     tools=tools,
#     verbose=True,
#     max_iterations=8,
# )


# def run_main_agent(batches):
#     """Runs the main agent itself"""

#     # Assemble prompt
#     # TODO: Turn batches into a fuckin string I guess lmao
#     batched_topics_str = "Topic 1, topic 2"

#     # TODO: Get a message history string for current convo
#     chat_history_str = "Message 1, message 2"

#     input_dict = {
#         "batched_topics_str": batched_topics_str,
#         "chat_history_str": chat_history_str,
#     }

#     # Run main agent
#     agent_executor.run(input_dict)

#     return None
