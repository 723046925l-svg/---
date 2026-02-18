import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(routes: [
      GoRoute(path: '/', builder: (_, __) => const HomePage()),
      GoRoute(path: '/doctor/:id', builder: (_, s) => Text('Doctor ${s.pathParameters['id']}')),
      GoRoute(path: '/clinic/:id', builder: (_, s) => Text('Clinic ${s.pathParameters['id']}')),
      GoRoute(path: '/appointment/:id', builder: (_, s) => Text('Appointment ${s.pathParameters['id']}')),
    ]);
    return MaterialApp.router(
      title: 'Iraq Health',
      locale: const Locale('en'),
      supportedLocales: const [Locale('en'), Locale('ar')],
      routerConfig: router,
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Iraq Health')),
    body: ListView(children: const [
      ListTile(title: Text('Phone OTP Login')),
      ListTile(title: Text('Browse Clinics/Doctors')),
      ListTile(title: Text('Book In-clinic / Video')),
      ListTile(title: Text('Payments + Notifications + Agora Join')),
    ]),
  );
}
