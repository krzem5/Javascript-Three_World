function setup(){
	if (window.PLAYER){
		function dispose(o){
			if (o.geometry){
				o.geometry.dispose()
			}
			scene.remove(o)
			for (var c of o.children){
				dispose(c)
			}
		}
		for (var o of OBJECTS){
			dispose(o.object)
		}
		dispose(PLAYER.model.object)
	}
	window.LEVEL_NAME=(window.LEVEL_NAME!=undefined?parseInt(LEVEL_NAME)+1:1).toString()
	window.COLORS=[]
	window.SIZE={}
	window.WORLD=[]
	window.MARKERS=[]
	window.START_BLOCK=null
	window.OBJECTS=[]
	window.CAN_MOVE=false
	window.CAN_CLICK=false
	window.PLAYER=null
	window.ACTIONS=[]
	window.THEME=0
	fetch(`./data/${LEVEL_NAME}.json`).then((r)=>r.json()).then(function(json){
		function _w(){
			let a=[]
			for (var x=0;x<SIZE.w;x++){
				a.push([])
				for (var y=0;y<SIZE.h;y++){
					a[x].push([])
					for (var z=0;z<SIZE.d;z++){
						a[x][y].push(-1)
					}
				}
			}
			a.set=function(x,y,z,b){
				if (x<0||x>SIZE.w-1||y<0||y>SIZE.h-1||z<0||z>SIZE.d-1){
					return
				}
				this[x][y][z]=b
			}
			a.recalc=function(){
				for (var x=0;x<SIZE.w;x++){
					for (var y=0;y<SIZE.h;y++){
						for (var z=0;z<SIZE.d;z++){
							this[x][y][z]=-1
						}
					}
				}
				for (var o of OBJECTS){
					o._add()
				}
			}
			a.is=function(x,y,z){
				return !(x<0||x>SIZE.w-1||y<0||y>SIZE.h-1||z<0||z>SIZE.d-1||this[x][y][z]==-1)
			}
			return a
		}
		CAN_CLICK=false
		CAN_MOVE=false
		document.title=json.name
		document.getElementsByClassName("name")[0].innerHTML=json.name
		document.getElementsByClassName("desc")[0].innerHTML=json.desc
		OVERLAY.material.opacity=1
		scene.background=new THREE.Color(0xffffff)
		LIGHT.position.set(json.light.pos.x,json.light.pos.y,json.light.pos.z)
		LIGHT.target.position.set(json.light.target_pos.x,json.light.target_pos.y,json.light.target_pos.z)
		cam.position.set(json.cam.pos.x,json.cam.pos.y,json.cam.pos.z)
		SIZE={w:json.size.x,h:json.size.y,d:json.size.z}
		PLAYER=new Player()
		WORLD=_w()
		for (var a of json.actions){
			ACTIONS.push(a)
		}
		for (var c of json.colors){
			COLORS.push(parseInt(c.substring(1),16))
		}
		for (var o of json.data){
			let b=new window[o.type.substring(0,1).toUpperCase()+o.type.substring(1)+"Block"](o.pos.x,o.pos.y,o.pos.z,COLORS[o.color]||0x000000,o.args||{})
			if (b.type=="start"){
				if (START_BLOCK!=null){
					START_BLOCK.type="box"
				}
				START_BLOCK=b
			}
		}
		for (var o of OBJECTS){
			for (var o2 of OBJECTS){
				if (o2==o||o2.checked_against.includes(o)){continue}
				o.checked_against.push(o2)
				if (Math.sqrt((o.pos.x-o2.pos.x)*(o.pos.x-o2.pos.x)+(o.pos.y-o2.pos.y)*(o.pos.y-o2.pos.y)+(o.pos.z-o2.pos.z)*(o.pos.z-o2.pos.z))<2){
					if (o.pos.x<o2.pos.x&&o.pos.y==o2.pos.y&&o.pos.z==o2.pos.z){
						o.faces[2]=false
						o2.faces[5]=false
					}
					if (o.pos.x>o2.pos.x&&o.pos.y==o2.pos.y&&o.pos.z==o2.pos.z){
						o.faces[5]=false
						o2.faces[2]=false
					}
					if (o.pos.x==o2.pos.x&&o.pos.y<o2.pos.y&&o.pos.z==o2.pos.z){
						o.faces[0]=false
						o2.faces[3]=false
					}
					if (o.pos.x==o2.pos.x&&o.pos.y>o2.pos.y&&o.pos.z==o2.pos.z){
						o.faces[3]=false
						o2.faces[0]=false
					}
					if (o.pos.x==o2.pos.x&&o.pos.y==o2.pos.y&&o.pos.z<o2.pos.z){
						o.faces[1]=false
						o2.faces[4]=false
					}
					if (o.pos.x==o2.pos.x&&o.pos.y==o2.pos.y&&o.pos.z==o2.pos.z){
						o.faces[4]=false
						o2.faces[1]=false
					}
				}
			}
			o._create()
			o._add()
		}
		for (var o of OBJECTS){
			o.place_marker()
		}
		START_BLOCK.spawn_player()
		document.getElementsByClassName("overlay")[0].style.opacity="0"
		function f(){
			OVERLAY.material.opacity-=0.01
			document.getElementsByClassName("overlay")[0].style.opacity=parseFloat(document.getElementsByClassName("overlay")[0].style.opacity)+0.01
			if (OVERLAY.material.opacity<=0.15){
				OVERLAY.material.opacity=0.15
				document.getElementsByClassName("overlay")[0].style.opacity=1
				CAN_CLICK=true
				return
			}
			setTimeout(f,1/60*1000)
		}
		setTimeout(f,1/60*1000)
	})
}
