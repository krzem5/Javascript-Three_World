class ButtonBlock extends BaseBlock{
	constructor(x,y,z,color,args){
		super(x,y,z,"button",color,args)
		this.button_color=this.args.color
		this.button_action_id=this.args.action_id
		this.button_pressed=false
		this.marker=null
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
		var m=box([true,true,true,false,true,true],7,3,7,COLORS[this.button_color]||0x000000)
		m.position.set(0,5,0)
		this.button_object=m
		group.add(m)
		group.position.set(this.pos.x*10,this.pos.y*10,this.pos.z*10)
		scene.add(group)
		return group
	}
	click(){
		if (this.button_action_id==null){return}
		CAN_MOVE=false
		this.button_pressed=true
		var ths=this
		function f(c=0){
			ths.button_object.position.y-=0.04
			ths.marker.object.position.y-=0.04
			ths.marker.hitbox_object.position.y-=0.04
			PLAYER.model.object.position.y-=0.04
			c++
			if (c==30){return}
			setTimeout(f,1/60*1000,c)
		}
		setTimeout(f,1/60*1000)
		var a=ACTIONS[this.button_action_id]||[]
		this.parse_action(a)
		this.button_action_id=null
	}
	parse_action(a){
		CAN_MOVE=false
		if (a.length==0){
			setTimeout(function(){
				WORLD.recalc()
			},100)
			CAN_MOVE=true
			return
		}
		var cmd=a.shift()
		var total_time=cmd.time
		if (cmd.data!=undefined){
			for (var c of cmd.data){
				if (c.type=="move"){
					(function(c){
						var o=OBJECTS[c.id]
						var pl=(PLAYER.pos.x==o.pos.x&&PLAYER.pos.y-1==o.pos.y&&PLAYER.pos.z==o.pos.z)
						var mm=new THREE.Vector3(c.offset.x*10/(total_time*60),c.offset.y*10/(total_time*60),c.offset.z*10/(total_time*60))
						function fm(cm=0){
							o.object.position.add(mm)
							if (pl==true){
								PLAYER.model.object.position.add(mm)
							}
							cm++
							if (cm>=total_time*60){
								o.pos={x:o.pos.x+c.offset.x,y:o.pos.y+c.offset.y,z:o.pos.z+c.offset.z}
								if (pl==true){
									PLAYER.pos={x:o.pos.x,y:o.pos.y+1,z:o.pos.z}
									PLAYER.model.object.position.set(o.pos.x*10,(o.pos.y+1)*10,o.pos.z*10)
								}
								if (o.marker!=null){o.marker.remove()}
								o.place_marker()
								if (o.marker!=null){
									o.marker.pos={x:o.pos.x,y:o.pos.y+1,z:o.pos.z}
									o.marker.hitbox_object.position.set(o.pos.x*10,(o.pos.y+1)*10-5,o.pos.z*10)
								}
								return
							}
							setTimeout(fm,1/60*1000,cm)
						}
						setTimeout(fm,1/60*1000)
					})(c)
				}
				if (c.type=="rotate"){
					(function(c){
						var o=OBJECTS[c.id]
						var mr=new THREE.Vector3(c.rotation.x/(total_time*60)/(180/Math.PI),c.rotation.y/(total_time*60)/(180/Math.PI),c.rotation.z/(total_time*60)/(180/Math.PI))
						function fr(cr=0){
							o.object.rotation.x+=mr.x
							o.object.rotation.y+=mr.y
							o.object.rotation.z+=mr.z
							cr++
							if (cr>=total_time*60){return}
							setTimeout(fr,1/60*1000,cr)
						}
						setTimeout(fr,1/60*1000)
					})(c)
				}
			}
		}
		var ths=this
		setTimeout(function(){
			ths.parse_action(a)
		},total_time*1000)
	}
	is_floor(){
		return true
	}
	is_empty(){
		return false
	}
}			
window.ButtonBlock=ButtonBlock