import { useSignIn } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import Ionicons from '@expo/vector-icons/build/Ionicons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(root)')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
        console.log('Sign-in not complete');
        // Client-side handler: show a warning or handle UI state instead of res
        console.warn('Sign-in not complete', signInAttempt)
      }
    }
    catch (err) {
      const error = err as { errors?: { code: string }[] }
      if (error.errors?.[0]?.code === "form_password_incorrect") {
        setError('Incorrect password. Please try again.')
      }
      else {
        setError('As Error occurred. Please try again.')
      }
    }
  }
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    // extraHeight={100}
    >

      <View style={styles.container}>
        <Image source={require('@/assets/images/revenue-i4.png')} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Guest access: navigate without signing in */}
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => router.replace({ pathname: '/(root)', params: { guest: 'true' } })}
        >
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>


        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/sign-up" asChild>

            {/* asChild
          Same behavior idea as in web UI libraries
          It tells the Link component to pass navigation behavior into its child instead of wrapping it.  */}

            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}