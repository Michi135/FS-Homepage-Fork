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
import { Vector2 } from 'three'
import { Vec2 } from 'three'

type Directions = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'NONE'
const directionMap: { [key: string]: Directions }
= {
  "a": "LEFT",
  "d": "RIGHT",
  "w": "UP",
  "s": "DOWN"
}

function vertexShader()
{
  return `
    varying vec4 pos_v;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      pos_v = vec4( position, 1.0 );
    }
  `
}

function fragmentShader()
{
  return `
    varying vec4 pos_v;

    void main() {

      //if (mod(floor(pos_v.x + pos_v.y), 2.f) > 1.f)
      if (pos_v.x < 0.f)
      {
        gl_FragColor = vec4(1,0,0,1);
      }
      else
      {
        gl_FragColor = vec4(0,1,0,1);
      }
    }
  `
}

function createBackground(size: Vector2, scene: THREE.Scene)
{
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const matRed = new THREE.MeshBasicMaterial({ color: 0x99ff99 })
  const matBlue = new THREE.MeshBasicMaterial({ color: 0x009933 })

  let i = 0
  for (let y = 0; y < size.y; ++y)
  {
    for (let x = 0; x < size.x; ++x, ++i)
    {
      if ((x + y) % 2 == 0)
      {
        const obj = new THREE.Mesh(geometry, matRed)
        obj.position.set(x - size.x / 2, y - size.y / 2, -1)
        scene.add(obj)
      }
      else
      {
        const obj = new THREE.Mesh(geometry, matBlue)
        obj.position.set(x - size.x / 2, y - size.y / 2, -1)
        scene.add(obj)
      }
    }
  }
}

export default defineComponent({
  setup: () =>
  {
    const renderElement = ref<HTMLDivElement | null>()

    const gridSize = new Vector2(20, 20)

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

    function isInside(position: Vector2, size: Vector2)
    {
      //y negative is down
      const topLeft = new Vector2(-size.x / 2, size.y / 2)
      const bottomRight = new Vector2(topLeft.x + size.x, topLeft.y - size.y)

      return !(position.x < topLeft.x || position.y >= topLeft.y || position.x >= bottomRight.x || position.y < bottomRight.y)
    }

    function move(pos: Vector2, direction: Directions)
    {
      const out = new Vector2()
      out.copy(pos)

      switch(direction)
      {
        case 'NONE': return out
        case 'LEFT': out.x -= 1
          break
        case 'RIGHT': out.x += 1
          break
        case "UP": out.y += 1
          break
        case "DOWN": out.y -= 1
      }
      return out
    }

    /*
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
    */

    onMounted(() =>
    {

      const ratio = renderElement.value!.clientWidth / renderElement.value!.clientHeight
      const height = 40
      const width = ratio * height

      //new THREE.Matrix4().makeScale(ratio, height)
      //THREE.Matrix4(ratio, height)

      const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2)
      //const posPro = new THREE.Vector3().setFromMatrixPosition(camera.projectionMatrix)
      //camera.projectionMatrix.setPosition(posPro.x + 1, posPro.y + 1, posPro.z)
      camera.position.z = 1
      const scene = new THREE.Scene()

      //const background =

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff6600 })

      const head = new THREE.Mesh(geometry, material)
      scene.add(head)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      createBackground(gridSize, scene)
      /*
      const backgroundMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader()
      })

      const backgeo = new THREE.BoxGeometry(20, 20, 1)
      const background = new THREE.Mesh(backgeo, backgroundMaterial)
      scene.add(background)
      */
      const food = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x996633 }))
      food.geometry.scale(0.7, 0.7, 1.0)
      scene.add(food)

      renderer.setSize(renderElement.value!.clientWidth, renderElement.value!.clientHeight)
      renderer.setAnimationLoop(animation)
      renderElement.value!.appendChild(renderer.domElement)

      function animation(time: number)
      {
        if (shouldUpdate(time))
        {
          const pos = new Vector2(head.position.x, head.position.y)
          const newPos = move(pos, direction)

          if (isInside(newPos, gridSize))
          {
            head.position.setX(newPos.x)
            head.position.setY(newPos.y)
          }
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