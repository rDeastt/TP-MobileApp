import React from 'react'
import { Redirect } from 'expo-router'

const BunnoApp = () => {


    return (
      <Redirect href='./HomeScreen'/>
      //<Redirect href='./ControlEmotionsScreen'/>
      //<Redirect href='./NameScreen'/> //este es el que debe estar default
    );
}

export default BunnoApp