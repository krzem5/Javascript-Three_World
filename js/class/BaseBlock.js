class BaseBlock{
	constructor(x,y,z,type,color,args){
		this.ID=OBJECTS.length
		this.pos={x,y,z}
		this.faces=[true,true,true,true,true,true]
		this.type=type
		this.args=args
		this.checked_against=[]
		this.color=color
		this.marker=null
		OBJECTS.push(this)
	}
	_create(){
		this.object=this.create_model()
		if (this.args.dark==true&&THEME==0&&this.type!="switch"){
			this.object.visible=false
		}
	}
	_add(){
		if (this.object.visible==false){return}
		this.pos.x=Math.floor(this.pos.x)
		this.pos.y=Math.floor(this.pos.y)
		this.pos.z=Math.floor(this.pos.z)
		WORLD.set(this.pos.x,this.pos.y,this.pos.z,this)
	}
	place_marker(){
		if (this.pos.x>=0&&this.pos.x<SIZE.w&&this.pos.y>=0&&this.pos.y<SIZE.h&&this.pos.z>=0&&this.pos.z<SIZE.d&&this.is_floor()&&((this.pos.y+1<SIZE.h&&((WORLD[this.pos.x][this.pos.y+1][this.pos.z]!=-1&&WORLD[this.pos.x][this.pos.y+1][this.pos.z].is_empty())||WORLD[this.pos.x][this.pos.y+1][this.pos.z]==-1))||this.pos.y+1>=SIZE.h)){
			new Marker(this,this.pos.x,this.pos.y+1,this.pos.z,(this.type=="switch"?(this.active==true?1.6:0.3):(this.type=="button"?(this.button_pressed==false?1.6:0.3):(this.type=="end"?1.6:0))))
		}
	}
	_switch(){
		function i(o){
			if (o.material&&o.material.color){
				(function(m){
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
				})(o.material.color)
			}
			for (var c of o.children){
				i(c)
			}
		}
		if (this.switch!=undefined){
			this.switch(THEME)
		}
		i(this.object)
		if ((THEME==1&&this.args.dark==true)||(THEME==0&&this.args.dark!=true)){
			this.object.visible=true
		}
		else if (this.type!="switch"&&this.args.ignore_theme!=true){
			this.object.visible=false
		}
	}
}