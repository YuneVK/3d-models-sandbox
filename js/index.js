window.onload = () => {
  let camera, scene, renderer
  let geometry, material, mesh
  let controls, mouse, cameraMoves

  let animating1 = false
  let animating2 = false
  let animating3 = false
  let animating4 = false

  const init = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20)
    camera.position.set(-1.8, 0.9, 2.7)

    controls = new THREE.OrbitControls(camera)
    controls.enabled = false
    // controls.target.set(0, -0.2, -0.2)
    // controls.update()

    scene = new THREE.Scene()
    // scene.background = new THREE.Color("#111111")

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    material = new THREE.MeshNormalMaterial()

    mesh = new THREE.Mesh(geometry, material)
    mesh.name = "Cubo"
    // scene.add(mesh)

    loadGLTF()

    // LIGHTS
    // var light = new THREE.AmbientLight(0x404040)
    // scene.add(light)

    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
    light.intensity = 3
    scene.add(light)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.gammaOutput = true // TODO: Buscar gammaOutput (es lo que hace que no se vea tan mal)
    renderer.setClearColor(0x000000, 0)

    mouse = { x: 0, y: 0 }
    cameraMoves = { x: 0, y: 0, z: -0.1, move: false, speed: 0.001 }

    window.addEventListener("mousemove", mouseMove)

    document.body.appendChild(renderer.domElement)

    window.scene = scene
  }

  function mouseMove(e) {
    camera.position.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, cameraMoves.speed), -cameraMoves.speed)
    camera.position.y += Math.max(Math.min((mouse.y - e.clientY) * 0.01, cameraMoves.speed), -cameraMoves.speed)

    mouse.x = e.clientX
    mouse.y = e.clientY
  }

  const animate = () => {
    requestAnimationFrame(animate)

    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02

    TWEEN.update()

    renderer.render(scene, camera)
  }

  const loadGLTF = () => {
    // Instantiate a loader
    var loader = new THREE.GLTFLoader()

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath("/models/irene.gltf")
    loader.setDRACOLoader(new THREE.DRACOLoader())

    // Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
    THREE.DRACOLoader.getDecoderModule()

    // Load a glTF resource
    loader.load(
      // resource URL
      "/models/irene.gltf",
      // called when the resource is loaded
      function(gltf) {
        gltf.scene.name = "Irene"

        // console.log(gltf)

        gltf.scene.children[1].intensity = 0.5
        gltf.scene.children[2].intensity = 0

        gltf.scene.updateMatrixWorld()
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3()).length()
        const center = box.getCenter(new THREE.Vector3())

        // console.log(gltf.scene)

        gltf.scene.position.x += gltf.scene.position.x - center.x
        gltf.scene.position.y += gltf.scene.position.y - center.y * 1.8
        gltf.scene.position.z += gltf.scene.position.z - center.z

        gltf.scene.rotation.x = -0.25
        gltf.scene.rotation.y = 2
        gltf.scene.rotation.z = 0.15

        gltf.scene.scale.x = 1.5
        gltf.scene.scale.y = 1.5
        gltf.scene.scale.z = 1.5

        console.log(gltf.scene)

        scene.add(gltf.scene)

        // console.log(gltf.scene)

        gltf.animations // Array<THREE.AnimationClip>
        gltf.scene // THREE.Scene
        gltf.scenes // Array<THREE.Scene>
        gltf.cameras // Array<THREE.Camera>
        gltf.asset // Object
        // console.log(scene)
      },
      // called while loading is progressing
      function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
        changePerLoaded((xhr.loaded / xhr.total) * 100)

        if ((xhr.loaded / xhr.total) * 100 === 100) hideLoader()
      },
      // called when loading has errors
      function(error) {
        console.log("An error happened")
      }
    )
  }

  const hideLoader = () => {
    addClass(document.querySelector(".loader"), "hidden")
  }

  const changePerLoaded = per => {
    document.querySelector(".loader span").innerHTML = ~~per
  }

  const addClass = (el, className) => {
    if (el.classList) el.classList.add(className)
    else el.className += " " + className
  }

  window.addEventListener("scroll", function() {
    var section1 = document.querySelector("main > section:nth-child(1)")
    var section2 = document.querySelector("main > section:nth-child(2)")
    var section3 = document.querySelector("main > section:nth-child(3)")
    var section4 = document.querySelector("main > section:nth-child(4)")

    console.log(scene.children[1])

    // let animation = new TWEEN.Tween(scene.children[1].rotation)
    //   .to({ x: -0.3, y: 2.5, z: 0.2 }, 1000)
    //   // .easing(TWEEN.Easing.Quadratic.EaseOut)
    //   .start()

    switch (true) {
      // case window.scrollY > section1.offsetTop + section1.offsetHeight:
      case window.scrollY > section4.offsetTop - section1.offsetHeight / 2:
        console.log("Scroll hasta la sección 4")
        if (!animating1) {
          var animation = new TWEEN.Tween(scene.children[1].rotation).to({ x: -1, y: 2, z: 0.15 }, 500).start()
          animating1 = true
          animating2 = false
          animating3 = false
          animating4 = false
          document.querySelector("body").style.backgroundColor = "blue"
        }
        break
      case window.scrollY > section3.offsetTop - section2.offsetHeight / 2:
        console.log("Scroll hasta la sección 3")
        if (!animating2) {
          var animation = new TWEEN.Tween(scene.children[1].rotation).to({ x: -0.4, y: 2, z: 0.15 }, 500).start()
          animating2 = true
          animating1 = false
          animating3 = false
          animating4 = false
          document.querySelector("body").style.backgroundColor = "red"
        }
        break
      case window.scrollY > section2.offsetTop - section3.offsetHeight / 2:
        console.log("Scroll hasta la sección 2")
        if (!animating3) {
          var animation = new TWEEN.Tween(scene.children[1].rotation).to({ x: 0.1, y: 2, z: 0.15 }, 500).start()
          animating3 = true
          animating1 = false
          animating2 = false
          animating4 = false
          document.querySelector("body").style.backgroundColor = "green"
        }
        break
      case window.scrollY > section1.offsetTop - section4.offsetHeight / 2:
        console.log("Scroll hasta la sección 1")
        if (!animating4) {
          var animation = new TWEEN.Tween(scene.children[1].rotation).to({ x: -0.15, y: 2, z: 0.15 }, 500).start()
          animating4 = true
          animating1 = false
          animating2 = false
          animating3 = false
          document.querySelector("body").style.backgroundColor = "teal"
        }
        break
    }
    // if (window.scrollY > section2.offsetTop + section2.offsetHeight) {
    //   console.log("You've scrolled past the second div")
    // }
  })

  init()
  animate()
}
