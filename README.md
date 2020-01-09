# Creative Writer Insight
The code here is for training, validating, and deploying the Creative Writer Insight web application, using a React-based front-end and Python-based back-end. The Bi-directional Selective Encoding with Template (BiSET) neural network is used to power our automated text summariation.

## What's the Creative Writer Insight tool?
Our Creative Writer Insight tool is a text summarization web application for news articles. The tool is intended to provide the writer insight on a reader's perspective of their written articles by generating an abstractive summary and retrieving related Google images, based off the summary.

![CreativeWriterInsight](https://drive.google.com/uc?export=view&id=1ua30nAP_Eot2dmJSFkgddmAM3Z7vGfF-)

### Bi-selective Encoding
The Bi-selective Encoding module is integrated with [OpenNMT](https://github.com/OpenNMT/OpenNMT-py). You can directly train it end to end with the [data](https://drive.google.com/file/d/1WtaDnpufPyqf8afFyfC13U_h56ars6CY/view?usp=sharing) by following steps:
1. Run ```python preprocess.py``` to prepare the data.
2. Run ```python train.py``` to train the model.
3. Run ```python translate.py``` to generate the summaries.

To send HTTP requests for inference, post a request to the endpoint: `http://0.0.0.0:5000/translator/translate`, using a json body using the same format as the example below. If a template is not generated, one can substitute the source article as the template.

```
[
    {
        "id": 0,
        "src": "the junior all whites have been eliminated from the fifa u - 20 world cup in colombia with results on the final day of pool play confirming their exit . sitting on two points , new zealand needed results in one of the final two groups to go their way to join the last 16 as one of the four best third place teams . but while spain helped the kiwis ' cause with a 5 - 1 thrashing of australia , a 3 - 0 win for ecuador over costa rica saw the south americans climb to second in group c with costa rica 's three points also good enough to progress in third place . that left the junior all whites hopes hanging on the group d encounter between croatia and honduras finishing in a draw . a stalemate - and a place in the knockout stages for new zealand - appeared on the cards until midfielder marvin ceballos netted an 81st minute winner that sent guatemala through to the second round and left the junior all whites packing their bags . new zealand finishes the 24 - nation tournament in 17th place , having claimed their first ever points at this level in just their second appearance at the finals .",
        "template": "junior all whites exit world cup"
    }
]
```
