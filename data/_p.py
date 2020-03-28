import glob
import json



for fn in glob.iglob("*.json"):
	data={}
	with open(fn,"r") as f:
		data=json.loads(f.read())
	with open(fn,"w") as f:
		f.write(json.dumps(data,indent=4,sort_keys=True).replace("    ","\t"))
