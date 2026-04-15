/** Sample inputs for Recommender and Detector tabs. */
export const EXAMPLES = {
  rec: [
    'Preciso implementar múltiplas formas de pagamento (Pix, cartão de crédito, boleto) em um app Flutter. O usuário escolhe qual usar na tela de checkout, e a lógica de processamento deve ser a mesma independente do método escolhido.',
    'Tenho um serviço de notificações que precisa enviar alertas por push (Firebase), email e SMS. A lógica de quando notificar é a mesma, mas o canal de envio muda conforme a preferência do usuário.',
    'Meu app precisa funcionar offline e online. Quando há internet, busca dados da API REST. Quando não há, usa o banco local (Hive/SQLite). O restante do app não deve saber de onde vieram os dados.',
    'Tenho uma tela que pode estar em 4 estados: carregando, sucesso, erro e vazia. Cada estado tem visual diferente e ações disponíveis diferentes. Estou usando muitos if/else para gerenciar isso.',
  ],
  det: [
    `abstract class PaymentStrategy {
  Future<bool> processPayment(double amount);
}
class PixStrategy implements PaymentStrategy {
  @override
  Future<bool> processPayment(double amount) async {
    print('PIX: R\$ \$amount'); return true;
  }
}
class PaymentProcessor {
  PaymentStrategy _strategy;
  PaymentProcessor(this._strategy);
  void setStrategy(PaymentStrategy s) => _strategy = s;
  Future<bool> pay(double amount) => _strategy.processPayment(amount);
}`,
    `mixin Observable<T> {
  final _listeners = <void Function(T)>[];
  void addListener(void Function(T) fn) => _listeners.add(fn);
  void notify(T value) => _listeners.forEach((fn) => fn(value));
}
class AuthStore with Observable<String> {
  void login(String userId) => notify(userId);
  void logout() => notify('');
}`,
    `abstract class UserRepository {
  Future<User?> findById(String id);
  Future<List<User>> findAll();
  Future<void> save(User user);
}
class RemoteUserRepository implements UserRepository {
  final ApiClient _api;
  RemoteUserRepository(this._api);
  @override Future<User?> findById(String id) async {
    final data = await _api.get('/users/\$id');
    return data != null ? User.fromJson(data) : null;
  }
  @override Future<List<User>> findAll() async => [];
  @override Future<void> save(User u) => _api.post('/users', u.toJson());
}`,
    `class AppConfig {
  static final AppConfig _instance = AppConfig._internal();
  AppConfig._internal();
  factory AppConfig() => _instance;
  late String apiBaseUrl;
  late String environment;
}`,
  ],
};
