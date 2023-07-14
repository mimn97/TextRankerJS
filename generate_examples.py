import json

def read_json_file(file):
    with open(file, "r") as r:
        response = r.read()
        response = response.replace('\n', '')
        response = response.replace('}{', '},{')
        response = "[" + response + "]"
        return json.loads(response)

def main():
    with open('/home/ryan/TextRankerJS/results/llm_preference_evalset.json', 'r') as file:
        data = file.read()
        dataset = json.loads(data)

    instructions = [data['instruction'] for data in dataset]
    references = [data['reference'] for data in dataset]
    N = 50
    responses = read_json_file("/home/ryan/TextRankerJS/results/full_n15_model_generations.json")[0]
    # print(responses)
    
    formatted_responses = []
    with open("results/human_annotation_exp.json", "w") as hae:
        keys = [keys for keys in responses]
        for i in range(N):
            reference = "Instruction: " + instructions[i] + "\n" + "Reference: " + references[i]
            exp = {"gold_label": "na", "contrast_label": "na", "reference": reference}
            for j in keys:
                exp[j] = responses[j][i]
            formatted_responses.append(exp)
        
        json.dump(formatted_responses, hae, indent=4)
        
    
if __name__ == '__main__':
    main()