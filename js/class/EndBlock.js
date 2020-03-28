class EndBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"end",color,args)
		this.reward_data=this.args.reward_data
		this.reward_object_time=-2
		this.reward_object_d=1
		this.end_anim_state=false
	}
	create_model(){
		function box(faces,w,h,d,color){
			function side(x,y,z,rx,ry,rz,w,h,c){
				var mesh=new THREE.Mesh(new THREE.PlaneBufferGeometry(w,h,1,1),new THREE.MeshStandardMaterial({color:c,flatShading:true,metalness:0.5,roughness:1,refractionRatio:0}))
				mesh.position.set(x,y,z)
				mesh.rotation.set(rx,ry,rz)
				return mesh
			}
			var group=new THREE.Group()
			if (faces[0]==true){group.add(side(0,h/2,0,-Math.PI/2,0,0,w,d,color))}
			if (faces[1]==true){group.add(side(0,0,d/2,0,0,0,w,h,color))}
			if (faces[2]==true){group.add(side(w/2,0,0,0,Math.PI/2,0,d,h,color))}
			if (faces[3]==true){group.add(side(0,-h/2,0,Math.PI/2,0,0,w,d,color))}
			if (faces[4]==true){group.add(side(0,0,-d/2,0,Math.PI,0,w,h,color))}
			if (faces[5]==true){group.add(side(-w/2,0,0,0,-Math.PI/2,0,d,h,color))}
			return group
		}
		function beam(x,z,h,c,f){
			var mesh=box(f,1,h,1,c)
			mesh.position.set(x,h/2-5,z)
			return mesh
		}
		var group=new THREE.Group()
		group.add(box([true,true,true,true,true,true],10,10,10,this.color))
		var m=box([true,true,true,false,true,true],6,3,6,COLORS[this.args.color]||0x000000)
		m.position.set(0,5,0)
		m.rotation.set(0,Math.PI*3/8,0)
		group.add(m)
		m=box([true,true,true,false,true,true],6,3,6,COLORS[this.args.color]||0x000000)
		m.position.set(0,5,0)
		m.rotation.set(0,Math.PI*1/8,0)
		group.add(m)
		m=new THREE.Mesh(new THREE[this.reward_data.name.substring(0,1).toUpperCase()+this.reward_data.name.substring(1)+"BufferGeometry"](...this.reward_data.args),new THREE.MeshStandardMaterial({color:COLORS[this.args.reward_color]||0x000000,flatShading:true,metalness:0.5,roughness:1,refractionRatio:0}))
		m.position.set(0,10,0)
		m.rotation.set(Math.PI/4,Math.PI/4,Math.PI/4)
		this.reward_object=m
		this.start_anim()
		group.add(m)
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	start_anim(){
		function sigmoid(x){
			return 1/(1+Math.pow(Math.E,-x))
		}
		var ths=this
		function f(){
			if (ths.end_anim_state==false){
				ths.reward_object_time+=ths.reward_object_d*0.04
				ths.reward_object.position.y=10+sigmoid(ths.reward_object_time)*2
			}
			ths.reward_object.rotation.x+=0.005
			ths.reward_object.rotation.y+=0.005
			ths.reward_object.rotation.z+=0.005
			if (ths.end_anim_state==false){
				if (Math.abs(ths.reward_object_time)>=2.3){
					ths.reward_object_d*=-1
				}
			}
			setTimeout(f,1/60*1000)
		}
		setTimeout(f,1/60*1000)
	}
	end_anim(e,frms){
		this.end_anim_state=true
		var up_steps=Math.floor(frms*2/3)
		var u=20
		var wait_frames=50
		var ths=this
		function f(c=0){
			if (c<=up_steps){
				ths.reward_object.position.y+=(u-ths.reward_object.position.y)*0.025
				PLAYER.model.angles
			}
			else if(c>up_steps+wait_frames){
				var v=e.get_end_pos().sub(ths.object.position)
				ths.reward_object.position.lerp(v,0.025)
				if (ths.reward_object.position.distanceTo(v)<0.025){
					PLAYER.end_anim()
					return
				}
			}
			c++
			setTimeout(f,1/60*1000,c)
		}
		setTimeout(f,1/60*1000)
	}
	is_floor(){
		return true
	}
	is_empty(){
		return false
	}
}
window.EndBlock=EndBlock