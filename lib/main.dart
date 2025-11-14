import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/citizen_screen.dart';
import 'screens/field_worker_screen.dart';
import 'services/api_service.dart';
import 'services/storage_service.dart';
import 'models/app_state.dart';

void main() {
  runApp(const GramSetuApp());
}

class GramSetuApp extends StatelessWidget {
  const GramSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppState()),
        Provider(create: (_) => ApiService()),
        Provider(create: (_) => StorageService()),
      ],
      child: MaterialApp(
        title: 'GramSetu AI',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          primaryColor: const Color(0xFF1976D2),
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF1976D2),
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF1976D2),
            foregroundColor: Colors.white,
            elevation: 2,
          ),
          bottomNavigationBarTheme: const BottomNavigationBarThemeData(
            backgroundColor: Color(0xFF1976D2),
            selectedItemColor: Colors.white,
            unselectedItemColor: Colors.white70,
            type: BottomNavigationBarType.fixed,
          ),
        ),
        home: const MainScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const CitizenScreen(),
    const FieldWorkerScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GramSetu AI'),
        centerTitle: true,
        actions: [
          // Sync button
          Consumer<AppState>(
            builder: (context, appState, child) {
              return IconButton(
                icon: Icon(
                  appState.isOnline ? Icons.sync : Icons.sync_disabled,
                  color: appState.isOnline ? Colors.white : Colors.orange,
                ),
                onPressed: () => _showSyncDialog(context),
                tooltip: 'Sync Data',
              );
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Citizen',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work),
            label: 'Field Worker',
          ),
        ],
      ),
    );
  }

  void _showSyncDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Sync Data'),
          content: const Text(
            'This will sync your offline data with the server. '
            'Make sure you have an internet connection.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            Consumer<AppState>(
              builder: (context, appState, child) {
                return ElevatedButton(
                  onPressed: appState.isOnline
                      ? () {
                          Navigator.of(context).pop();
                          _performSync(context);
                        }
                      : null,
                  child: const Text('Sync'),
                );
              },
            ),
          ],
        );
      },
    );
  }

  void _performSync(BuildContext context) async {
    final appState = Provider.of<AppState>(context, listen: false);
    final apiService = Provider.of<ApiService>(context, listen: false);
    final storageService = Provider.of<StorageService>(context, listen: false);

    try {
      // Show loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      // Sync offline complaints
      await storageService.syncOfflineComplaints(apiService);
      
      // Sync complaint updates
      await storageService.syncOfflineUpdates(apiService);

      // Close loading dialog
      Navigator.of(context).pop();

      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Data synced successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      // Close loading dialog
      Navigator.of(context).pop();
      
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Sync failed: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}


