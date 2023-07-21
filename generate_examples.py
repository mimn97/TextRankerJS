import json
import random

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
    ground_truth = []
    K = len(responses) # num of modles
    with open("results/human_annotation_exp.json", "w") as hae, open("results/human_annotation_ground_truth.json", "w") as gt, open("results/human_annotation_gt_formatted.json", "w") as gtf:
        keys = [keys for keys in responses]
        
        for i in range(N):
            true_order = {}  
            models = []
            for idx in range(K):
                models.append(f'System {chr(ord("A") + idx)}')          
            exp = {"gold_label": "na", "contrast_label": "na", "instruction": instructions[i], "reference": references[i]}
            for j in keys:
                model = models.pop(random.randrange(len(models)))
                true_order[j] = model
                exp[model] = responses[j][i]
            formatted_responses.append(exp)
            ground_truth.append(true_order)
        
        json.dump(formatted_responses, hae, indent=4)
        json.dump(ground_truth, gt)
        json.dump(ground_truth, gtf, indent=4)
        
    
if __name__ == '__main__':
    main()