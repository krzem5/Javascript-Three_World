class Marker{
	constructor(b,x,y,z,oy){
		this.b=b
		this.pos={x,y,z}
		this.oy=oy
		this.create_model()
		this.b.marker=this
	}
	create_model(){
		var group=new THREE.Group()
		var m=new THREE.Mesh(new THREE.CircleBufferGeometry(3,50),new THREE.MeshBasicMaterial({color:0xfafafa,side:THREE.DoubleSide,transparent:true,opacity:0}))
		m.rotation.x=Math.PI/2
		m.position.set(0,-4.9,0)
		group.add(m)
		group.position.set(0,10+this.oy,0)
		this.object=group
		this.b.object.add(group)
		var p=new THREE.Mesh(new THREE.PlaneBufferGeometry(10,10,1,1),new THREE.MeshBasicMaterial({side:THREE.BackSide,transparent:true,opacity:0}))
		p.position.set(this.b.object.position.x,this.b.object.position.y+5+this.oy,this.b.object.position.z)
		p.rotation.x=Math.PI/2
		scene.add(p)
		p.marker_class=this
		MARKERS.push(p)
		this.hitbox_object=p
	}
	click(){
		for (var ch of this.object.children){
			ch.material.opacity=0.9
		}
		var ths=this
		function f(c=0){
			for (var ch of ths.object.children){
				ch.material.opacity-=0.9/20
			}
			c++
			if (c>=20||ths.object.children[0].material.opacity>=0.9*19/20){return}
			setTimeout(f,1/30*1000,c)
		}
		setTimeout(f,1/30*1000)
		PLAYER.moveTo(this.pos.x,this.pos.y,this.pos.z)
	}
	remove(){
		MARKERS.splice(MARKERS.indexOf(this.hitbox_object),1)
		scene.remove(this.hitbox_object)
		this.b.object.remove(this.object)
		this.b.marker=null
	}
}