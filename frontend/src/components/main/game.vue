<template>
  <div
    ref="renderElement"
    style="width: 100%; height: 100%"
    @keydown="keyDownHandler"
    @keyup="keyUpHandler"
    tabindex="1"
  ></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as THREE from 'three'

type Directions = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'NONE'
const directionMap: { [key: string]: Directions }
= {
  "a": "LEFT",
  "d": "RIGHT",
  "w": "UP",
  "s": "DOWN"
}


export default defineComponent({
  setup: () =>
  {
    const renderElement = ref<HTMLDivElement | null>()

    const gridSize = { x: 20, y: 20 }

    let currentKey = ''
    //TODO:: no direction on start and prompt to choose initial direction
    let direction: Directions = 'NONE'

    const keyDownHandler = (event: KeyboardEvent) =>
    {
      if (event.repeat)
        return
        //console.log(event.key)
      if (["a", "s", "w", "d"].includes(event.key))
      {
        currentKey = event.key
        direction = directionMap[event.key]
      }
    }

    const keyUpHandler = (event: KeyboardEvent) =>
    {
      if (event.key === currentKey)
        currentKey = ''
    }

    function createBlock(x: number, y: number)
    {

    }

    let lastUpdate = 0
    function shouldUpdate(time: number)
    {
      const currentTime = Math.floor(time / 300)
      if (currentTime > lastUpdate)
      {
        lastUpdate = currentTime
        return true
      }
      return false
    }

    function move(head: THREE.Mesh)
    {
      switch(direction)
      {
        case 'NONE': return
        case 'LEFT': head.position.x -= 1
          break
        case 'RIGHT': head.position.x += 1
          break
        case "UP": head.position.y += 1
          break
        case "DOWN": head.position.y -= 1
      }
    }

    onMounted(() =>
    {

      const ratio = renderElement.value!.clientWidth / renderElement.value!.clientHeight
      const height = 40
      const width = ratio * height

      //new THREE.Matrix4().makeScale(ratio, height)
      //THREE.Matrix4(ratio, height)

      const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2)
      camera.position.z = 1
      const scene = new THREE.Scene()

      //const background =

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshNormalMaterial()

      const head = new THREE.Mesh(geometry, material)
      scene.add(head)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      const program = new THREE.WebGLProgram(renderer, 'abc',
        {
          vertexShader: `
                varying vec4 color;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                if (floor((position.x + position.y) % 2 == 0))
                {
                    color = vec4(1,0,0,1);
                }
                else
                {
                    color = vec4(0,1,0,1);
                }
            `,
          fragmentShader: `
                varying vec4 color;
                gl_FragColor = color;
            `
        })
      const backgroundMaterial = new THREE.ShaderMaterial({

        /*uniforms: {

            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() }

            },*/
        //@ts-ignore
        vertexShader: program.vertexShader,
        //@ts-ignore
        fragmentShader: program.fragmentShader
      })

      const backgeo = new THREE.BoxGeometry(20, 20, 1)
      const background = new THREE.Mesh(backgeo, backgroundMaterial)
      scene.add(background)


      renderer.setSize(renderElement.value!.clientWidth, renderElement.value!.clientHeight)
      renderer.setAnimationLoop(animation)
      renderElement.value!.appendChild(renderer.domElement)

      function animation(time: number)
      {
        if (shouldUpdate(time))
        {
          move(head)
        }
        //mesh.rotation.x = time / 2000;
        //mesh.rotation.y = time / 1000;

        renderer.render(scene, camera)

      }
    })
    return {
      renderElement,
      keyDownHandler,
      keyUpHandler
    }
  }
})
</script>