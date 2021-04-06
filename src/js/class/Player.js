class Player{
	constructor(){
		this.pos={x:-1,y:-1,z:-1}
		this.dir=0
		this.model=new PlayerModel(this)
		this.path=[]
		this.SPEED=30
		this.end=false
	}
	moveTo(px,py,pz){
		var path=[]
		var checked=[]
		function check_perspective(x,y,z){
			checked.push(x,y,z)
			var op=[]
			for (var v of path){
				var a=[]
				for (var p of v){
					a.push(p)
				}
				op.push(a)
			}
			for (var i=0;i<Math.max(SIZE.w,SIZE.h,SIZE.d);i++){
				path.push([90,x-i,y+i,z-i,true])
				var s=check(x-i,y+i,z-i-1)
				if (s==2){return 2}
				else{path=op.slice()}
				path.push([180,x-i,y+i,z-i,true])
				s=check(x-i-1,y+i,z-i)
				if (s==2){return 2}
				else{path=op.slice()}
				path.push([-90,x+0,y+0,z+1,false])
				s=check(x+i,y-i,z+i+1)
				if (s==2){return 2}
				else{path=op.slice()}
				path.push([0,x+1,y+0,z+0,false])
				s=check(x+i+1,y-i,z+i)
				if (s==2){return 2}
				else{path=op.slice()}
			}
			return 1
		}
		function check(x,y,z){
			x=Math.floor(x)
			y=Math.floor(y)
			z=Math.floor(z)
			if (!WORLD.is(x,y-1,z)||checked.includes(WORLD[x][y-1][z])||WORLD[x][y-1][z].is_floor()==false||(WORLD[x][y][z]!=-1&&WORLD[x][y][z].is_empty()==false)||WORLD[x][y-1][z].object.visible==false){
				return 0
			}
			checked.push(WORLD[x][y-1][z])
			path.push([x,y+(WORLD[x][y-1][z].type=="button"?(WORLD[x][y-1][z].button_pressed==false?0.15:0.03):(WORLD[x][y-1][z].type=="switch"?(WORLD[x][y-1][z].active==true?0.15:0.03):0)),z])
			if (x==px&&y==py&&z==pz){return 2}
			var op=[]
			for (var v of path){
				var a=[]
				for (var p of v){
					a.push(p)
				}
				op.push(a)
			}
			var s=check(x+1,y,z)
			if (s==2){return 2}
			if (s==1){path=op.slice()}
			s=check(x-1,y,z)
			if (s==2){return 2}
			if (s==1){path=op.slice()}
			s=check(x,y,z+1)
			if (s==2){return 2}
			if (s==1){path=op.slice()}
			s=check(x,y,z-1)
			if (s==2){return 2}
			if (s==1){path=op.slice()}
			s=check_perspective(x,y,z)
			if (s==2){return 2}
			return 1
		}
		var s=check(this.pos.x,this.pos.y,this.pos.z)
		if (s<2){
			return
		}
		if (path.length==1){return}
		CAN_MOVE=false
		this.path=path
		this.format_path()
		this.update()
	}
	spawn(x,y,z,dir){
		this.pos={x,y,z}
		this.dir=dir
		this.model.update()
	}
	format_path(){
		function gd(a,b){
			if (a[0]<b[0]){return 0}
			if (a[0]>b[0]){return 180}
			if (a[2]<b[2]){return -90}
			if (a[2]>b[2]){return 90}
		}
		var np=[]
		var lp=null
		var cd=this.dir
		var i=0
		for (var p of this.path){
			if (lp==null){
				lp=p
				i++
				continue
			}
			let d;
			if (p.length>3){
				if (p[4]==true){
					np.push({type:"set",pos:{x:p[1],y:p[2],z:p[3]}})
					lp=null
				}
				d=p[0]
			}
			else{
				d=gd(lp,p)
			}
			if (d!=cd&&Math.abs(d-cd)!=360){
				var r=(d-cd)%360
				if (r==-270){r=90}
				if (r==270){r=-90}
				if (Math.abs(r)==180){r*=(Math.random()>0.5?-1:1)}
				np.push({type:"turn",amt:r})
				cd=d
			}
			if (p.length>3){
				if (p[4]==true){
					lp=p.slice(1)
					i++
					continue
				}
				p=p.slice(1)
			}
			if (WORLD[p[0]][Math.round(p[1]-1)][p[2]].type=="button"){
				np.push({type:"move",amt:[p[0]-lp[0],p[1]-lp[1],p[2]-lp[2]]})
				break
			}
			if (WORLD[p[0]][Math.round(p[1]-1)][p[2]].type=="switch"){
				np.push({type:"move",amt:[p[0]-lp[0],p[1]-lp[1],p[2]-lp[2]]})
				break
			}
			if (lp[1]%1>0){
				if (Math.round(lp[1]%1*100)>8){
					lp[1]-=0.12
				}
			}
			if (WORLD[p[0]][Math.round(p[1]-1)][p[2]].type=="end"){
				np.push({type:"end",amt:[(p[0]-lp[0]!=0?(p[0]-lp[0]>0?1:-1)*0.5:0),p[1]-lp[1],(p[2]-lp[2]!=0?(p[2]-lp[2]>0?1:-1)*0.5:0)],pos:{x:p[0],y:p[1],z:p[2]}})
				break
			}
			np.push({type:"move",amt:[p[0]-lp[0],p[1]-lp[1],p[2]-lp[2]]})
			lp=p
			i++
			if (p.length>3&&p[3]==false){
				var p=this.path[i]
				np.push({type:"set",pos:{x:p[0],y:p[1],z:p[2]}})
				lp=null
			}
		}
		this.path=np.reverse().slice()
	}
	update(){
		if (this.path.length==0){
			CAN_MOVE=true
			return
		}
		var a=this.path.pop()
		var frames=1
		if (a.type=="turn"){
			frames=this.model.turn(a.amt)
		}
		else if (a.type=="move"){
			frames=this.model.walk(a.amt)
		}
		else if (a.type=="set"){
			frames=1
			this.pos=Object.assign({},a.pos)
			this.model.update([])
			this.pos.y=Math.floor(this.pos.y)
		}
		else if (a.type=="end"){
			this.end=true
			frames=this.model.end(a.amt,a.pos)
		}
		var ths=this
		setTimeout(function(){
			ths.update()
		},frames/60*1000)
	}
	end_anim(){
		function f(){
			OVERLAY.material.opacity+=0.01
			if (OVERLAY.material.opacity>=1){
				OVERLAY.material.opacity=1
				setup()
				return
			}
			setTimeout(f,1/60*1000)
		}
		setTimeout(f,1/60*1000)
	}
	_invert(){
		function i(o){
			if (o.material&&o.material.linecolor){
				(function(m){
					var frames=15
					var t={r:(m.x-(1-m.x))/frames,g:(m.y-(1-m.y))/frames,b:(m.z-(1-m.z))/frames}
					function f(c=0){
						m.x-=t.r
						m.y-=t.b
						m.z-=t.g
						c++
						if (c>=frames){
							return
						}
						setTimeout(f,1/60*1000,c)
					}
					setTimeout(f,1/60*1000)
				})(o.material.linecolor)
			}
			for (var c of o.children){
				i(c)
			}
		}
		i(this.model.object)
	}
}
