
import requests
import urllib

url = "http://ec2-54-145-51-144.compute-1.amazonaws.com:3000/chatbot"
obj = { 'cs' : ''}

if __name__ == "__main__":
	print("Start your conversation with Cleverbot!" + " " + "Write your first words here:")
	while (True):
		inCon = input()
		out_r = { 'input': inCon, 'cs': obj['cs']}
		get_req = url + "?" +  urllib.parse.urlencode(out_r)
		# print(get_req)
		r = requests.get(get_req)
		# print(r.json())
		obj = r.json()
		# print(obj)
		print(obj['output'])