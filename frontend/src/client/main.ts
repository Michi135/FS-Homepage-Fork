import { createDefaultApp } from '@shared/app.js'

const { router, app } = createDefaultApp()

router.isReady().then(() =>
{
  app.mount('#app', true)
})


if (import.meta.env.DEV)
{
  router.onError((error, to) => {
    console.warn(error)
    window.location.href = to.fullPath
  })
}

/*
import.meta.hot?.on('vite:beforeUpdate', (data) => {
  console.log("BU")
  console.log(data)
})

import.meta.hot?.on('vite:afterUpdate', (data) => {
  console.log("AU")
  console.log(data)
})

import.meta.hot?.on('vite:beforeFullReload', (data) => {
  console.log("bFR")
  console.log(data)
})

import.meta.hot?.on('vite:beforePrune', (data) => {
  console.log("bP")
  console.log(data)
})

import.meta.hot?.on('vite:invalidate', (data) => {
  console.log("i")
  console.log(data)
})

import.meta.hot?.on('vite:error', (data) => {
  console.log("e")
  console.log(data)
})*/