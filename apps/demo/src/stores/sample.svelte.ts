export class SampleStore {
  name = $state('World');
  count = $state(0);

  // Login demo state
  email = $state('');
  password = $state('');
  isLoggedIn = $state(false);

  increment = () => {
    this.count += 1;
  };

  reset = () => {
    this.count = 0;
    this.name = 'World';
  };

  login = () => {
    // Simulate API call
    console.log(`Logging in with ${this.email} / ${this.password}`);
    this.isLoggedIn = true;
    alert(`Logged in as ${this.email}!`);
  };

  logout = () => {
    this.isLoggedIn = false;
    this.email = '';
    this.password = '';
  };
}

export const sampleStore = new SampleStore();
