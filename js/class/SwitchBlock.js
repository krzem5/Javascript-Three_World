class SwitchBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"switch",color,args)
		this.active=true
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
		var m=box([true,true,true,false,true,true],7,3,7,COLORS[this.args.color]||0x000000)
		m.position.set(0,5,0)
		this.button_object=m
		group.add(m)
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	is_floor(){
		return true
	}
	is_empty(){
		return false
	}
	press(v){
		if (this.active==false){return}
		CAN_MOVE=false
		this.active=false
		if (this.args.to_dark==true&&THEME==0){
			THEME=1
			scene.background=new THREE.Color(0xffffff)
			var F=function(m){
				var frames=15
				var t={r:(m.r-(1-m.r))/frames,g:(m.g-(1-m.g))/frames,b:(m.b-(1-m.b))/frames}
				function f(c=0){
					m.r-=t.r
					m.b-=t.b
					m.g-=t.g
					c++
					if (c>=frames){
						return
					}
					setTimeout(f,1/60*1000,c)
				}
				setTimeout(f,1/60*1000)
			}
			F(scene.background)
		}
		if (this.args.to_light==true&&THEME==1){
			THEME=0
			scene.background=new THREE.Color(0x000000)
			var F=function(m){
				var frames=15
				var t={r:(m.r-(1-m.r))/frames,g:(m.g-(1-m.g))/frames,b:(m.b-(1-m.b))/frames}
				function f(c=0){
					m.r-=t.r
					m.b-=t.b
					m.g-=t.g
					c++
					if (c>=frames){
						return
					}
					setTimeout(f,1/60*1000,c)
				}
				setTimeout(f,1/60*1000)
			}
			F(scene.background)
		}
		for (var o of OBJECTS){
			o._switch()
		}
		WORLD.recalc()
		PLAYER._invert()
		var ths=this
		function f(c=0){
			ths.button_object.position.y-=0.04
			ths.marker.object.position.y-=0.04
			ths.marker.hitbox_object.position.y-=0.04
			PLAYER.model.object.position.y-=0.04
			c++
			if (c==30){
				CAN_MOVE=true
				return
			}
			setTimeout(f,1/60*1000,c)
		}
		setTimeout(f,1/60*1000)
		return 30
	}
	switch(theme){
		if (this.active==false){return}
		if ((theme==0&&this.args.to_dark==true)||(theme==1&&this.args.to_light==true)){
			this.press()
		}
	}
}
window.SwitchBlock=SwitchBlock