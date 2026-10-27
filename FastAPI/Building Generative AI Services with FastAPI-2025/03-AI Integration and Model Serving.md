# Chapter 3. AI Integration and Model Serving

## Language Models

RNNs can only predict the next item in a sequence by looking at the items that came before, they struggle with this ideal in capturing long-range dependencies and modeling patterns in large chunks of texts.

## Tokenization and embedding

Any piece of text must be sliced into a list of tokens that represent words, syllables, symbols, and punctuations.
These tokens are then mapped to unique numbers so that patterns can be numerically modeled.

After tokenization, you need to use an embedder to convert these tokens into dense vectors of real numbers called embeddings, capturing semantic information

cosine similarity: Smaller angles imply higher similarity, representing similar context and meaning.
