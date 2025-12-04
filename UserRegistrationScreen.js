// UserRegistrationScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UserRegistrationScreen({ onRegistered }) {
  const [name, setName]   = useState('');
  const [dob, setDob]     = useState('');   // YYYY-MM-DD
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!name || !dob || !phone) {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع البيانات');
      return;
    }
    try {
      await AsyncStorage.setItem(
        'user_info',
        JSON.stringify({ name, dob, phone })
      );
      Alert.alert('تم', 'تم التسجيل بنجاح', [
        { text: 'موافق', onPress: () => onRegistered?.() },
      ]);
    } catch (e) {
      Alert.alert('خطأ', 'تعذر حفظ البيانات');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>مرحبًا بك في سليم</Text>

        <Text style={styles.label}>الاسم</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="اكتب اسمك"
          placeholderTextColor="#64748b"
          textAlign="right"
        />

        <Text style={styles.label}>تاريخ الميلاد (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="1998-05-26"
          placeholderTextColor="#64748b"
          textAlign="right"
        />

        <Text style={styles.label}>رقم الجوال</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="05xxxxxxxx"
          placeholderTextColor="#64748b"
          textAlign="right"
        />

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>ابدأ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { color: '#cbd5e1', marginTop: 10, marginBottom: 6, textAlign: 'right' },
  input: {
    backgroundColor: '#020617', borderWidth: 1, borderColor: '#334155',
    borderRadius: 10, color: 'white', padding: 12,
  },
  btn: { backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
