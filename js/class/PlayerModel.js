class PlayerModel{
	constructor(p){
		this.player=p
		this.default_model={
			body: {
				a: [0,-1,0],
				b: [0,3.4,0]
			},
			head: this.gen_head_path(),
			rLeg: {
				a: [0,-1,0],
				b: [0,-1,1.2]
			},
			rKnee: {
				a: [0,-1,1.2],
				b: [0,-5,1.2]
			},
			rShoulder: {
				a: [0,3.4,0],
				b: [0,2.4,1.4]
			},
			rArm: {
				a: [0,2.4,1.4],
				b: [0,0.4,1.4]
			},
			lLeg: {
				a: [0,-1,0],
				b: [0,-1,-1.2]
			},
			lKnee: {
				a: [0,-1,-1.2],
				b: [0,-5,-1.2]
			},
			lShoulder: {
				a: [0,3.4,0],
				b: [0,2.4,-1.4]
			},
			lArm: {
				a: [0,2.4,-1.4],
				b: [0,0.4,-1.4]
			}
		}
		this.default_angles=this.cals_default_angles()
		this.angles=this.cals_default_angles(true)
		this.model={}
		this.ROT_ANIM_SPEED=10
		this.MOVE_ANIM_SPEED=30
		this.animation=false
		this.create_model()
		this.start_default_anim()
	}
	cals_default_angles(s=false){
		var da=[]
		for (var k in this.default_model){
			if (k=="head"&&s==false){
				da[k]={}
				var done=[]
				for (var v in this.default_model[k]){
					if (v=="a"){continue}
					var p=new THREE.Vector3(...this.default_model[k][v]).sub(new THREE.Vector3(...this.default_model[k].a))
					var r=Math.sqrt(p.x*p.x+p.y*p.y+p.z*p.z)
					var a=(r==0?0:Math.acos(p.y/r)*(180/Math.PI))
					if (done.includes(Math.floor(a))){
						a=360-a
					}
					done.push(Math.floor(a))
					da[k][v]={a,b:90}
				}
				continue
			}
			else if (k=="head"){
				da[k]={a:0,b:0,c:0}
				continue
			}
			var v=new THREE.Vector3(...this.default_model[k].b).sub(new THREE.Vector3(...this.default_model[k].a))
			var r=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z)
			var a=Math.acos(v.y/r)*(180/Math.PI)
			var b=Math.atan2(v.z,v.x)*(180/Math.PI)
			da[k]={a,b}
		}
		return da
	}
	gen_head_path(){
		var p={}
		var i=65
		p[String.fromCharCode(i++).toLowerCase()]=[0,3.4,0]
		for (var a=0;a<=Math.PI*2;a+=Math.PI*2/15){
			p[String.fromCharCode(i++).toLowerCase()]=[0,5.4+Math.cos(a+Math.PI)*1.2,Math.sin(a+Math.PI)*1.2]
		}
		p[String.fromCharCode(i++).toLowerCase()]=[0,3.4,0]
		return p
	}
	create_model(){
		var group=new THREE.Group()
		for (var k in this.default_model){
			var g=new THREE.Geometry()
			for (var j in this.default_model[k]){
				g.vertices.push(new THREE.Vector3(...this.default_model[k][j]))
			}
			var m=new THREE.MeshLineMaterial({lineWidth:10})
			m.linecolor.x=0
			m.uniforms.fWidth.value=0.3
			m=new THREE.MeshLine(g,m)
			this.model[k]=m
			group.add(m)
		}
		group.position.set(this.player.pos.x,this.player.pos.y,this.player.pos.z)
		scene.add(group)
		this.object=group
	}
	update(tu){
		this.object.position.set(this.player.pos.x*10,this.player.pos.y*10,this.player.pos.z*10)
		this.object.rotation.y=this.player.dir/(180/Math.PI)
		this.update_joins(tu)
	}
	update_joins(tu=[0,1,2,3,4,5,6,7,8,9]){
		function sphere_point(x,y,z,dox,doy,doz,ox,oy,oz,a,b){
			var r=Math.sqrt((x-dox)*(x-dox)+(y-doy)*(y-doy)+(z-doz)*(z-doz))
			var C=Math.pow(10,9)
			return new THREE.Vector3(Math.floor((r*Math.sin(a)*Math.cos(b)+ox)*C)/C,Math.floor((r*Math.cos(a)+oy)*C)/C,Math.floor((r*Math.sin(a)*Math.sin(b)+oz)*C)/C)
		}
		function calc(ths,n,aP){
			ths.model[n].geometry.vertices[0]=aP
			ths.model[n].geometry.vertices[1]=sphere_point(...ths.default_model[n].b,...ths.default_model[n].a,...aP.toArray(),ths.angles[n].a/(180/Math.PI),ths.angles[n].b/(180/Math.PI))
		}
		function calc_head(ths){
			var i=0
			ths.model.head.geometry.vertices[0]=ths.model.body.geometry.vertices[1].clone()
			var aP=ths.model.body.geometry.vertices[1].toArray()
			for (var v in ths.default_model.head){
				if (v=="a"){continue}
				ths.model.head.geometry.vertices[i]=sphere_point(...ths.default_model.head[v],...ths.default_model.head.a,...aP,(ths.angles.head.a+ths.default_angles.head[v].a)/(180/Math.PI),(ths.angles.head.b+ths.default_angles.head[v].b)/(180/Math.PI))
				i++
			}
		}
		if (tu.includes(0)){calc(this,"body",new THREE.Vector3(...this.default_model.body.a))}
		if (tu.includes(1)){calc_head(this)}
		if (tu.includes(2)){calc(this,"rLeg",this.model.body.geometry.vertices[0].clone())}
		if (tu.includes(3)){calc(this,"rKnee",this.model.rLeg.geometry.vertices[1].clone())}
		if (tu.includes(4)){calc(this,"rShoulder",this.model.body.geometry.vertices[1].clone())}
		if (tu.includes(5)){calc(this,"rArm",this.model.rShoulder.geometry.vertices[1].clone())}
		if (tu.includes(6)){calc(this,"lLeg",this.model.body.geometry.vertices[0].clone())}
		if (tu.includes(7)){calc(this,"lKnee",this.model.lLeg.geometry.vertices[1].clone())}
		if (tu.includes(8)){calc(this,"lShoulder",this.model.body.geometry.vertices[1].clone())}
		if (tu.includes(9)){calc(this,"lArm",this.model.lShoulder.geometry.vertices[1].clone())}
	}
	start_default_anim(){
		if (this.player.end==true||this.animation==true){
			return
		}
		var frames=350
		var a_add=10/frames
		var b_add=10/frames
		var c_add=12/frames
		var d_add=12/frames
		this.angles.rShoulder.a=this.default_angles.rShoulder.a+0
		this.angles.lShoulder.a=this.default_angles.lShoulder.a+0
		this.angles.rShoulder.b=this.default_angles.rShoulder.b+0
		this.angles.lShoulder.b=this.default_angles.lShoulder.b+0
		this.angles.rArm.a=this.default_angles.rArm.a+0
		this.angles.lArm.a=this.default_angles.lArm.a+0
		this.angles.rArm.b=this.default_angles.rArm.b+0
		this.angles.lArm.b=this.default_angles.lArm.b+0
		this.angles.rShoulder.a-=a_add*frames/2
		this.angles.lShoulder.a-=a_add*frames/2
		this.angles.rShoulder.b-=b_add*frames/2
		this.angles.lShoulder.b-=b_add*frames/2
		this.angles.rArm.a-=c_add*frames/2
		this.angles.lArm.a-=c_add*frames/2
		this.angles.rArm.b-=d_add*frames/2
		this.angles.lArm.b-=d_add*frames/2
		var ths=this
		function f(c=0,d=1){
			ths.angles.rShoulder.a+=a_add*d
			ths.angles.lShoulder.a+=a_add*d
			ths.angles.rShoulder.b+=b_add*d
			ths.angles.lShoulder.b+=b_add*d
			ths.angles.rArm.a+=c_add*d
			ths.angles.lArm.a+=c_add*d
			ths.angles.rArm.b+=d_add*d
			ths.angles.lArm.b+=d_add*d
			ths.update_joins([4,5,8,9])
			c++
			if (c%frames==0){
				d=-d
			}
			if (ths.animation==true||ths.player.end==true){
				ths.angles.rShoulder.a=ths.default_angles.rShoulder.a+0
				ths.angles.lShoulder.a=ths.default_angles.lShoulder.a+0
				ths.angles.rShoulder.b=ths.default_angles.rShoulder.b+0
				ths.angles.lShoulder.b=ths.default_angles.lShoulder.b+0
				ths.angles.rArm.a=ths.default_angles.rArm.a+0
				ths.angles.lArm.a=ths.default_angles.lArm.a+0
				ths.angles.rArm.b=ths.default_angles.rArm.b+0
				ths.angles.lArm.b=ths.default_angles.lArm.b+0
				ths.update_joins([4,5,8,9])
				return
			}
			setTimeout(f,1/60*1000,c,d)
		}
		setTimeout(f,1/60*1000)
	}
	turn(d){
		if (Math.abs(d)>90){
			var fr=this.turn(d/2)
			var ths=this
			setTimeout(function(){
				ths.turn(d/2)
			},fr/60*1000)
			return fr*2
		}
		this.animation=true
		var frames=this.ROT_ANIM_SPEED+0
		var add=d/frames/(180/Math.PI)
		var ths=this
		function ft(ct=0){
			ths.object.rotation.y+=add
			ct++
			if (ct>=frames){
				ths.player.dir=(ths.player.dir+d+360)%360
				ths.object.rotation.y=ths.player.dir/(180/Math.PI)
				ths.animation=false
				ths.start_default_anim()
				return
			}
			setTimeout(ft,1/60*1000,ct)
		}
		setTimeout(ft,1/60*1000)
		return frames
	}
	walk(d){
		this.animation=true
		var frames=this.MOVE_ANIM_SPEED+0
		var add=new THREE.Vector3(d[0]/frames*10,d[1]/frames*10,d[2]/frames*10)
		var a_add=30/(frames/4)
		var b_add=20/(frames/4)
		var c_add=10/(frames/4)
		var ths=this
		function fm(cm=0){
			ths.object.position.add(add)
			if (cm<frames/4||cm>=frames*0.75){
				ths.angles.rKnee.a-=a_add
				ths.angles.rShoulder.b+=c_add
				ths.angles.rArm.a+=b_add+c_add
				ths.angles.lKnee.a+=a_add
				ths.angles.lShoulder.b+=c_add
				ths.angles.lArm.a-=b_add+c_add
			}
			else{
				ths.angles.rKnee.a+=a_add
				ths.angles.rShoulder.b-=c_add
				ths.angles.rArm.a-=b_add+c_add
				ths.angles.lKnee.a-=a_add
				ths.angles.lShoulder.b-=c_add
				ths.angles.lArm.a+=b_add+c_add
			}
			cm++
			if (cm>frames){
				ths.angles.rKnee.a=ths.default_angles.rKnee.a+0
				ths.angles.rShoulder.b=ths.default_angles.rShoulder.b+0
				ths.angles.rArm.a=ths.default_angles.rArm.a+0
				ths.angles.lKnee.a=ths.default_angles.lKnee.a+0
				ths.angles.lShoulder.b=ths.default_angles.lShoulder.b+0
				ths.angles.lArm.a=ths.default_angles.lArm.a+0
				ths.player.pos.x+=d[0]
				ths.player.pos.y+=Math.round(d[1])
				ths.player.pos.z+=d[2]
				ths.object.position.set(ths.player.pos.x*10,ths.player.pos.y*10+(d[1]>0?d[1]:0)*10,ths.player.pos.z*10)
				if (WORLD[ths.player.pos.x][ths.player.pos.y-1][ths.player.pos.z].type=="button"){
					WORLD[ths.player.pos.x][ths.player.pos.y-1][ths.player.pos.z].click()
				}
				if (WORLD[ths.player.pos.x][ths.player.pos.y-1][ths.player.pos.z].type=="switch"){
					WORLD[ths.player.pos.x][ths.player.pos.y-1][ths.player.pos.z].press()
				}
				ths.update_joins([3,4,5,7,8,9])
				ths.animation=false
				ths.start_default_anim()
				return
			}
			ths.update_joins([3,4,5,7,8,9])
			setTimeout(fm,1/60*1000,cm)
		}
		setTimeout(fm,1/60*1000)
		return frames+5
	}
	end(d,e){
		this.animation=true
		var frames=this.MOVE_ANIM_SPEED/2
		var arm_frames=50
		var add=new THREE.Vector3(d[0]/frames*10,d[1]/frames*10,d[2]/frames*10)
		var a_add=15/(frames/2)
		var b_add=10/(frames/2)
		var c_add=5/(frames/2)
		var d_add=90/arm_frames
		var e_add=25/arm_frames
		var f_add=25/arm_frames
		var ths=this
		function fm(cm=0){
			if (cm<=frames){
				ths.object.position.add(add)
				if (cm<frames/2){
					ths.angles.rKnee.a-=a_add
					ths.angles.rShoulder.b+=c_add
					ths.angles.rArm.a+=b_add+c_add
					ths.angles.lKnee.a+=a_add
					ths.angles.lShoulder.b+=c_add
					ths.angles.lArm.a-=b_add+c_add
				}
				else{
					ths.angles.rKnee.a+=a_add
					ths.angles.rShoulder.b-=c_add
					ths.angles.rArm.a-=b_add+c_add
					ths.angles.lKnee.a-=a_add
					ths.angles.lShoulder.b-=c_add
					ths.angles.lArm.a+=b_add+c_add
				}
				ths.update_joins([3,4,5,7,8,9])
			}
			else{
				if (cm==frames+1){
					WORLD[e.x][e.y-1][e.z].end_anim(ths,arm_frames)
					ths.player.pos.x+=d[0]
					ths.player.pos.y+=Math.round(d[1])
					ths.player.pos.z+=d[2]
					ths.object.position.set(ths.player.pos.x*10,ths.player.pos.y*10,ths.player.pos.z*10)
					ths.angles.rKnee.a=ths.default_angles.rKnee.a+0
					ths.angles.rShoulder.b=ths.default_angles.rShoulder.b+0
					ths.angles.rArm.a=ths.default_angles.rArm.a+0
					ths.angles.lKnee.a=ths.default_angles.lKnee.a+0
					ths.angles.lShoulder.b=ths.default_angles.lShoulder.b+0
					ths.angles.lArm.a=ths.default_angles.lArm.a+0
					ths.update_joins([3,7])
					ths.update([])
				}
				ths.angles.rArm.a-=d_add
				ths.angles.rShoulder.a+=e_add
				ths.angles.rShoulder.b-=f_add
				ths.angles.lArm.a-=d_add
				ths.angles.lShoulder.a+=e_add
				ths.angles.lShoulder.b+=f_add
				ths.update_joins([4,5,8,9])
			}
			cm++
			if (cm>frames+arm_frames){
				return
			}
			setTimeout(fm,1/60*1000,cm)
		}
		setTimeout(fm,1/60*1000)
		return frames+arm_frames
	}
	get_end_pos(){
		var v=new THREE.Vector3()
		var tx=this.model.rArm.geometry.vertices[1].x/2+this.model.lArm.geometry.vertices[1].x/2
		var tz=this.model.rArm.geometry.vertices[1].z/2+this.model.lArm.geometry.vertices[1].z/2
		v.x=tx*Math.cos(-this.object.rotation.y)-tz*Math.sin(-this.object.rotation.y)+this.player.pos.x*10
		v.y=this.model.rArm.geometry.vertices[1].y/2+this.model.lArm.geometry.vertices[1].y/2+this.player.pos.y*10+1.5
		v.z=tx*Math.sin(-this.object.rotation.y)+tz*Math.cos(-this.object.rotation.y)+this.player.pos.z*10
		return v
	}
}