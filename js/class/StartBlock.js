class StartBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"start",color,args)
		this.start_player_dir=this.args.start_player_dir
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
		var group=new THREE.Group()
		group.add(box([true,true,true,true,true,true],10,10,10,this.color))
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	spawn_player(){
		PLAYER.spawn(this.pos.x,this.pos.y+1,this.pos.z,this.start_player_dir)
	}
	is_floor(){
		return true
	}
	is_empty(){
		return false
	}
}
window.StartBlock=StartBlock