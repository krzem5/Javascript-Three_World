var scene,cam,renderer,RAYCATSER,LIGHT,OVERLAY
function init(){
	scene=new THREE.Scene()
	cam=new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,0.1,100000)
	cam.position.set(0,500,0)
	cam.rotation.set(-2.3562,-0.616,-2.618)
	cam.zoom=14
	cam.updateProjectionMatrix()
	renderer=new THREE.WebGLRenderer({antialias:true})
	renderer.setSize(window.innerWidth,window.innerHeight)
	scene.background=new THREE.Color().setHSL(1,1,1)
	document.getElementsByClassName("cnv")[0].appendChild(renderer.domElement)
	scene.add(new THREE.AmbientLight(0xececec,1))
	var point=new THREE.SpotLight(0xffffff,1,0,1)
	point.position.set(1000,500,750)
	point.target.position.set(0,0,0)
	point.castShadow=true
	point.shadow.mapSize.width=1024
	point.shadow.mapSize.height=1024
	point.shadow.camera.near=0.5
	point.shadow.camera.far=15000
	point.add(new THREE.Mesh(new THREE.BoxBufferGeometry(30,30,30),new THREE.MeshBasicMaterial({color:0xffff00,flatShading:true})))
	scene.add(point)
	scene.add(point.target)
	LIGHT=point
	RAYCATSER=new THREE.Raycaster()
	OVERLAY=new THREE.Sprite(new THREE.SpriteMaterial({color:0x000000,transparent:true,opacity:1,lights:false,depthWrite:false,depthTest:false}))
	OVERLAY.scale.set(window.innerWidth,window.innerHeight,1)
	scene.add(OVERLAY)
	window.addEventListener("click",click,false)
	window.addEventListener("resize",resize,false)
	requestAnimationFrame(render)
	setup()
}
function render(){
	renderer.render(scene,cam)
	requestAnimationFrame(render)
}
function resize(){
	renderer.setSize(window.innerWidth,window.innerHeight)
	cam.left=window.innerWidth/-2
	cam.right=window.innerWidth/2
	cam.top=window.innerHeight/2
	cam.bottom=window.innerHeight/-2
	cam.updateProjectionMatrix()
}
function click(e){
	e.preventDefault()
	if (CAN_CLICK==true){
		CAN_CLICK=false
		var steps=50
		var a_sub=OVERLAY.material.opacity/steps
		var b_sub=1/steps
		CAN_MOVE=true
		function f(){
			OVERLAY.material.opacity-=a_sub
			document.getElementsByClassName("overlay")[0].style.opacity-=b_sub
			if (OVERLAY.material.opacity<=0){
				OVERLAY.material.opacity=0
				document.getElementsByClassName("overlay")[0].style.opacity=0
				return
			}
			setTimeout(f,1/60*1000)
		}
		setTimeout(f,1/60*1000)
		return
	}
	if (OVERLAY.material.opacity>0||CAN_MOVE==false||PLAYER.end==true){
		return
	}
	var cp=renderer.domElement.getBoundingClientRect()
	e=new THREE.Vector2(((e.clientX-cp.x)/renderer.domElement.width)*2-1,-((e.clientY-cp.y)/renderer.domElement.height)*2+1)
	RAYCATSER.setFromCamera(e,cam)
	var i=RAYCATSER.intersectObjects(MARKERS,true)
	if (i.length>0){
		i[0].object.marker_class.click()
	}
}
window.addEventListener("DOMContentLoaded",init,false)
