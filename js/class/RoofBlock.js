class RoofBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"roof",color,args)
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
		function pyramid(c){
			var g=new THREE.Geometry()
			g.vertices=[new THREE.Vector3(-5,-5,-5),new THREE.Vector3(-5,-5,5),new THREE.Vector3(5,-5,5),new THREE.Vector3(5,-5,-5),new THREE.Vector3(0,5,0)]
			g.faces=[new THREE.Face3(0,1,2),new THREE.Face3(0,2,3),new THREE.Face3(1,0,4),new THREE.Face3(2,1,4),new THREE.Face3(3,2,4),new THREE.Face3(0,3,4)]
			return new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,flatShading:true,metalness:0.5,roughness:1,refractionRatio:0,side:THREE.BackSide}))
		}
		function flag1(c){
			var m=box([true,true,true,false,true,true],1,22,1,c)
			m.position.set(0,13,0)
			return m
		}
		function flag2(c){
			var group=new THREE.Group()
			var m=box([true,true,true,false,true,true],1,22,1,c)
			m.position.set(0,13,0)
			m.visible=false
			group.add(m)
			m=box([true,true,true,true,true,true],5,4,2,c)
			m.position.set(-3,19,0)
			group.add(m)
			return group
		}
		var group=new THREE.Group()
		group.add(pyramid(this.color))
		if (this.args.flag==true){
			var f1=flag1(this.color)
			group.add(f1)
			var f2=flag2(this.color)
			group.add(f2)
			this.flag=f2
			this.start_flag_anim()
		}
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	start_flag_anim(){
		function sigmoid(x){
			return 1/(1+Math.pow(Math.E,-x))
		}
		var ths=this
		function f(c=0,d=1){
			c+=d*0.04
			ths.flag.rotation.y=(sigmoid(c)*20-10)/(180/Math.PI)
			if (Math.abs(c)>=3){
				d*=-1
			}
			setTimeout(f,1/60*1000,c,d)
		}
		setTimeout(f,1/60*1000)
	}
	is_floor(){
		return false
	}
	is_empty(){
		return false
	}
}
window.RoofBlock=RoofBlock