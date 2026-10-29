import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from '../components/Feedback';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';
import PostListScreen from '../screens/posts/PostListScreen';
import PostDetailScreen from '../screens/posts/PostDetailScreen';
import PostFormScreen from '../screens/posts/PostFormScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminPostsScreen from '../screens/admin/AdminPostsScreen';
import UserListScreen from '../screens/admin/UserListScreen';
import UserFormScreen from '../screens/admin/UserFormScreen';
import { colors } from '../theme';

const Root = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const BlogStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();

const opcoesPadrao = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: colors.background }
};

function BlogNavigator() {
  return (
    <BlogStack.Navigator screenOptions={opcoesPadrao}>
      <BlogStack.Screen name="PostList" component={PostListScreen} options={{ title: 'Blog POSTECH' }} />
      <BlogStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
      <BlogStack.Screen name="PostForm" component={PostFormScreen} options={{ title: 'Post' }} />
    </BlogStack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={opcoesPadrao}>
      <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Administração' }} />
      <AdminStack.Screen name="AdminPosts" component={AdminPostsScreen} options={{ title: 'Postagens' }} />
      <AdminStack.Screen name="PostForm" component={PostFormScreen} options={{ title: 'Post' }} />
      <AdminStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />

      {/* Professores e alunos reaproveitam as mesmas telas, trocando o parâmetro role */}
      <AdminStack.Screen
        name="ProfessorList"
        component={UserListScreen}
        initialParams={{ role: 'professor' }}
        options={{ title: 'Professores' }}
      />
      <AdminStack.Screen
        name="ProfessorForm"
        component={UserFormScreen}
        initialParams={{ role: 'professor' }}
        options={{ title: 'Professor' }}
      />
      <AdminStack.Screen
        name="AlunoList"
        component={UserListScreen}
        initialParams={{ role: 'aluno' }}
        options={{ title: 'Alunos' }}
      />
      <AdminStack.Screen
        name="AlunoForm"
        component={UserFormScreen}
        initialParams={{ role: 'aluno' }}
        options={{ title: 'Aluno' }}
      />
    </AdminStack.Navigator>
  );
}

function PerfilNavigator() {
  return (
    <PerfilStack.Navigator screenOptions={opcoesPadrao}>
      <PerfilStack.Screen name="PerfilHome" component={PerfilScreen} options={{ title: 'Minha conta' }} />
    </PerfilStack.Navigator>
  );
}

const icones = {
  Blog: ['home', 'home-outline'],
  Admin: ['grid', 'grid-outline'],
  Perfil: ['person-circle', 'person-circle-outline']
};

function TabsNavigator() {
  const { ehProfessor } = useAuth();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => {
          const [ativo, inativo] = icones[route.name];
          return <Ionicons name={focused ? ativo : inativo} size={size} color={color} />;
        }
      })}
    >
      <Tabs.Screen name="Blog" component={BlogNavigator} />
      {/* A aba administrativa só existe para professores autenticados */}
      {ehProfessor ? <Tabs.Screen name="Admin" component={AdminNavigator} /> : null}
      <Tabs.Screen name="Perfil" component={PerfilNavigator} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { carregando } = useAuth();

  if (carregando) return <Loading texto="Iniciando..." />;

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={opcoesPadrao}>
        <Root.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
        <Root.Screen
          name="Login"
          component={LoginScreen}
          options={{ presentation: 'modal', title: 'Entrar' }}
        />
      </Root.Navigator>
    </NavigationContainer>
  );
}
