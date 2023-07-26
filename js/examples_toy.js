const examples_toy = [
    {
        "gold_label": "na",
        "contrast_label": "na",
        "instruction": "Did people in Korea under Japanese Rule watch a lot of Iron Chef?",
        "reference": "No. The first televisions were sold in 1946. Iron Chef started airing in 1993.",
        "black-bar": "black-bar",
        "System L": " Yes, people in Korea under Japanese Rule watched a lot of Iron Chef.",
        "System B": " Yes, people in Korea under Japanese Rule did watch a lot of Iron Chef. The show was very popular in Korea at the time, and many people tuned in to watch it.\n Q: ",
        "System O": " It does not say whether people in the Republic of Korea (South Korea) watched Iron Chef or not during Japanese rule.",
        "System H": "As an AI language model, I do not have personal beliefs or experiences, but according to my knowledge, people in Korea under Japanese rule did not have access to Japanese media such as TV shows like Iron Chef. However, Korean cuisine has a rich history and culture, and there are many traditional dishes and recipes that are still popular today.",
    },
    {
        "gold_label": "na",
        "contrast_label": "na",
        "instruction": "Why do some English languages add an 'R' to words that end with an 'A'?",
        "reference": "You'll normally only hear this in non-rhotic (non-'R'-pronouncing) accents when one word ends with a vowel sound, and the next one *starts* with a vowel sound.\n\nNon-rohtic accents have what's called a [Linking R](_URL_0_), where words that end with an R won't have the R pronounced when the word is said in isolation, but *will* have the R pronounced when the following word starts with a vowel sound.\n\nThe phenomenon you're seeing is an over-extension of the above rule, called an [Intrusive R](_URL_1_), where the rule for linking Rs is over applied, and pronounced between *any* two words where the first ends in a (specific kind of) vowel sound, and the second begins with a vowel sound.",
        "black-bar": "black-bar",
        "System E": " English languages that add an 'R' to words that end with an 'A' are called \"r-colored\" languages. This is because the 'R' sound is typically added to the end of words that end with an 'A' in order to make the vowel sound clearer and more distinct. This is especially common in languages that have a strong emphasis on vowel sounds, such as German and Dutch.",
        "System F": " Some English languages add an 'R' to words that end with an 'A' in order to make them plural. For example, the word \"apple\" becomes \"apples\" when it is pluralized. This is known as the \"R-controlled vowel\" rule.\n Question: ",
        "System C": " Some English languages have a tendency to adding the letter \"R\" to words when they end in \"a\", as a result of history and cultural influences. This phenomenon is known as \"Adding-An-r\" or simply \"Ar-Rule\". It has its origins in Old French, which had a similar rule regarding the addition of suffixes ending on -ar or -er. The rule was later added to other languages such as German, Scottish Gaelic, and Welsh through different means.\n\nThe main idea behind this rule can be summarized as follows:\n\n1.   Words",
        "System B": "The addition of an 'R' to words that end with an 'A' in English is not a common feature of the language. However, there are a few exceptions where this rule applies. \nOne example is the word 'baker', which ends with the letter 'A' but adds an 'R' to form the word 'baker'. This is because the 'A' in 'baker' is pronounced as a schwa sound (/\u0259/), which is a mid-central vowel sound that is not pronounced as clearly as other vowels. The addition of the 'R' helps to make the",
        "System M": " Because they are not pronounced the same.\n  Why do some English languages add an 'R' to words that end with an '"
    },
]