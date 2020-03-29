class BeamBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"beam",color,args)
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
		if (this.faces[0]==false){
			group.add(beam(-4.5,-4.5,10,this.color,[false,true,true,true,true,true]))
			group.add(beam(4.5,-4.5,10,this.color,[false,true,true,true,true,true]))
			group.add(beam(4.5,4.5,10,this.color,[false,true,true,true,true,true]))
			group.add(beam(-4.5,4.5,10,this.color,[false,true,true,true,true,true]))
		}
		else{
			group.add(beam(-4.5,-4.5,9,this.color,[false,true,true,true,true,true]))
			group.add(beam(4.5,-4.5,9,this.color,[false,true,true,true,true,true]))
			group.add(beam(4.5,4.5,9,this.color,[false,true,true,true,true,true]))
			group.add(beam(-4.5,4.5,9,this.color,[false,true,true,true,true,true]))
			var m=box([true,true,true,true,true,true],10,1,10,this.color)
			m.position.set(0,4.5,0)
			group.add(m)
		}
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	is_floor(){
		return (this.faces[0]==true)
	}
	is_empty(){
		return true
	}
}
window.BeamBlock=BeamBlock