import { ScrollView, View, Text, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { api } from '../src/lib/api'
import ptBr from 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [memories, setMemories] = useState<Memory[]>([])

  async function singOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1 px-7"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <View className="flex-row gap-1.5">
          <TouchableOpacity
            onPress={singOut}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
            >
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>
            <View className="space-y-4">
              <Image
                className="aspect-video w-full rounded-lg"
                source={{ uri: memory.coverUrl }}
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais{' '}
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
