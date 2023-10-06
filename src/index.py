
import boto3
import json

bedrock = boto3.client(service_name='bedrock-runtime')

def lambda_handler(event, context):

    print("boto3 version"+ boto3.__version__)
    print(event['text'])

    prompt="Given the transcript provided at the end of the prompt, return a JSON object with the following properties: description, titles, and tags. For the description write a compelling description for a YouTube video, that is maximum two paragraphs long and has good SEO. Don't focus on the person who is mentioned in the video, just focus on the content of the video. The description should be in the same language as the video. For the title, return an array of 5 different title options for this video. For the tags, provide an array of 20 tags for the video. Here is the transcript of the video: {}".format(event['text'])

    body = json.dumps({
        "prompt": prompt,
        "maxTokens": 1525,
        "temperature": 0.7,
        "topP": 1,
        "stopSequences":[],
        "countPenalty":{"scale":0},
        "presencePenalty":{"scale":0},
        "frequencyPenalty":{"scale":0}})
    modelId = 'ai21.j2-ultra-v1'
    accept = 'application/json'
    contentType = 'application/json'

    response = bedrock.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)

    response_body = json.loads(response.get('body').read())
    
    result = json.dumps(response_body.get("completions")[0].get("data").get("text"))
    print(result)

    return result


