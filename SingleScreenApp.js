// SingleScreenApp.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// لو ما كان عندك api/openai.js خلي الدالة ترجع نص ثابت
let askOpenAI = async () => "نصيحة عامة: قلّل السكريات البسيطة، زِد الخضار والمشي اليومي 30 دقيقة.";
try {
  // إن وُجد الملف سيُستبدل التنفيذ بالنُسخة الفعلية
  const mod = require("./api/openai");
  if (mod?.askOpenAI) askOpenAI = mod.askOpenAI;
} catch (_) {}

/* ============ Styles ============ */
const styles = {
  screen: { flex: 1, backgroundColor: "#020617" },
  container: { padding: 16 },
  card: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
  label: {
    color: "#cbd5e1",
    textAlign: "right",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    padding: 12,
    borderRadius: 10,
    color: "white",
    textAlign: "right",
  },
  helper: { color: "#64748b", fontSize: 11, textAlign: "right", marginTop: 4 },
  btn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
  },
  btnText: { textAlign: "center", color: "white", fontWeight: "bold", fontSize: 15 },
  sectionTitle: {
    color: "#e5e7eb",
    textAlign: "right",
    marginTop: 18,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "600",
  },
};

const Pill = ({ label, active, onPress, grow }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      marginHorizontal: 4,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: active ? "#3b82f6" : "#334155",
      backgroundColor: active ? "#1d4ed8" : "transparent",
      flexGrow: grow ? 1 : undefined,
    }}
  >
    <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>{label}</Text>
  </TouchableOpacity>
);

/* ============ Intro ============ */
function IntroScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ color: "white", fontSize: 38, fontWeight: "900", marginBottom: 4 }}>
            سَلِيم
          </Text>
          <Text style={{ color: "#38bdf8", fontSize: 16, letterSpacing: 4 }}>SALIM</Text>
          <Text
            style={{
              color: "#94a3b8",
              fontSize: 14,
              marginTop: 16,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            مساعد ذكي لتقييم نمط حياتك وخطر الإصابة بالسكري باستخدام قياسات بسيطة ونصائح مخصصة.
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ModeSelect")}>
          <Text style={styles.btnText}>ابدأ الفحص</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Mode Select ============ */
function ModeSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>اختر نوع التقييم</Text>

          <TouchableOpacity
            style={{ backgroundColor: "#1e293b", padding: 16, borderRadius: 14, marginTop: 10 }}
            onPress={() => navigation.navigate("Lifestyle")}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600", textAlign: "right" }}>
              مؤشر أسلوب الحياة
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 6, textAlign: "right" }}>
              تقييم التغذية، النشاط، التدخين، التوتر و BMI بدرجة من 0 إلى 10.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: "#1e293b", padding: 16, borderRadius: 14, marginTop: 14 }}
            onPress={() => navigation.navigate("DiabetesRisk")}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600", textAlign: "right" }}>
              مقياس خطر الإصابة بالسكري (FINDRISC)
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 6, textAlign: "right" }}>
              تقدير خطر الإصابة بالسكري خلال 10 سنوات.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Lifestyle Index (SLIQ) ============ */
function LifestyleIndexScreen() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [dietQ1, setDietQ1] = useState(0);
  const [dietQ2, setDietQ2] = useState(0);
  const [dietQ3, setDietQ3] = useState(0);

  const [activityLevel, setActivityLevel] = useState(0);
  const [smokingScore, setSmokingScore] = useState(2);
  const [stressLevel, setStressLevel] = useState(3);

  const [totalScore, setTotalScore] = useState(0);
  const [category, setCategory] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const maxScore = 10;
  const dietOptions = [
    { label: "أقل من مرة بالأسبوع", value: 0 },
    { label: "مرة في الأسبوع", value: 1 },
    { label: "٢–٣ مرات في الأسبوع", value: 2 },
    { label: "٤–٦ مرات في الأسبوع", value: 3 },
    { label: "مرة في اليوم", value: 4 },
    { label: "مرتين في اليوم أو أكثر", value: 5 },
  ];

  const getDietScore = () => {
    const raw = dietQ1 + dietQ2 + dietQ3; // 0–15
    if (raw <= 5) return 0;
    if (raw <= 10) return 1;
    return 2;
  };
  const getBmiScore = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return 0;
    const m = h / 100;
    const bmi = w / (m * m);
    if (bmi < 25) return 2;
    if (bmi < 30) return 1;
    return 0;
  };
  const getStressScore = () => {
    if (stressLevel <= 2) return 0;
    if (stressLevel <= 4) return 1;
    return 2;
  };
  const classifyLifestyle = (score) => {
    if (score <= 4) return "نمط حياة غير صحي";
    if (score <= 7) return "نمط حياة متوسط";
    return "نمط حياة صحي";
  };

  const handleCalculate = async () => {
    if (!name) {
      Alert.alert("تنبيه", "رجاءً أدخل اسمك.");
      return;
    }
    const dietScore = getDietScore();
    const bmiScore = getBmiScore();
    const activityScore = activityLevel;
    const smokeScore = smokingScore;
    const stressScore = getStressScore();

    const total = dietScore + bmiScore + activityScore + smokeScore + stressScore;
    const cat = classifyLifestyle(total);

    setTotalScore(total);
    setCategory(cat);

    setAiAdvice("");
    setLoadingAdvice(true);
    try {
      const prompt = `
الاسم: ${name}
الطول: ${height || "غير معروف"} سم
الوزن: ${weight || "غير معروف"} كجم
درجة التغذية: ${dietScore} ، النشاط: ${activityScore} ، التدخين: ${smokeScore} ، التوتر: ${stressScore}
إجمالي مؤشر أسلوب الحياة: ${total}/10 (${cat})
أعطني نصيحة عربية موجزة لتحسين نمط الحياة (≤120 كلمة).
`;
      const answer = await askOpenAI(prompt);
      setAiAdvice(answer || "");
    } catch (e) {
      setAiAdvice("نصيحة عامة: نم مبكرًا، اشرب ماء كفاية، وامشِ 30–45 دقيقة يوميًا.");
    }
    setLoadingAdvice(false);
  };

  const ratio = Math.min(totalScore / maxScore, 1);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>مؤشر أسلوب الحياة (SLIQ)</Text>

          <Text style={styles.label}>الاسم</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسمك"
            placeholderTextColor="#64748b" />

          <Text style={styles.label}>الطول (سم)</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight}
            keyboardType="numeric" placeholder="مثال: 170" placeholderTextColor="#64748b" />

          <Text style={styles.label}>الوزن (كجم)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight}
            keyboardType="numeric" placeholder="مثال: 70" placeholderTextColor="#64748b" />

          <Text style={styles.sectionTitle}>أولًا: التغذية</Text>
          <Text style={styles.helper}>حدّد عدد المرات التقريبي لكل نوع خلال العام الماضي.</Text>

          <Text style={styles.label}>1) خس/سلطة ورقية</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {dietOptions.map((o) => (
              <Pill key={`q1-${o.value}`} label={o.label} active={dietQ1 === o.value}
                onPress={() => setDietQ1(o.value)} grow />
            ))}
          </View>

          <Text style={styles.label}>2) فواكه (بدون العصائر)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {dietOptions.map((o) => (
              <Pill key={`q2-${o.value}`} label={o.label} active={dietQ2 === o.value}
                onPress={() => setDietQ2(o.value)} grow />
            ))}
          </View>

          <Text style={styles.label}>3) حبوب كاملة/خبز كامل</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {dietOptions.map((o) => (
              <Pill key={`q3-${o.value}`} label={o.label} active={dietQ3 === o.value}
                onPress={() => setDietQ3(o.value)} grow />
            ))}
          </View>

          <Text style={styles.sectionTitle}>ثانيًا: النشاط البدني الأسبوعي</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Pill label="خفيف" active={activityLevel === 0} onPress={() => setActivityLevel(0)} grow />
            <Pill label="متوسط" active={activityLevel === 1} onPress={() => setActivityLevel(1)} grow />
            <Pill label="قوي" active={activityLevel === 2} onPress={() => setActivityLevel(2)} grow />
          </View>

          <Text style={styles.sectionTitle}>ثالثًا: التدخين</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="مدخن" active={smokingScore === 0} onPress={() => setSmokingScore(0)} />
            <Pill label="سابقًا" active={smokingScore === 1} onPress={() => setSmokingScore(1)} />
            <Pill label="غير مدخن" active={smokingScore === 2} onPress={() => setSmokingScore(2)} />
          </View>

          <Text style={styles.sectionTitle}>رابعًا: مستوى التوتر (1 = عالٍ … 6 = منخفض)</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setStressLevel(n)}
                style={{
                  width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center",
                  backgroundColor: stressLevel === n ? "#1d4ed8" : "transparent",
                  borderWidth: 1, borderColor: stressLevel === n ? "#3b82f6" : "#334155",
                }}>
                <Text style={{ color: "white" }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helper}>١–٢: توتر مرتفع · ٣–٤: متوسط · ٥–٦: جيد.</Text>

          <TouchableOpacity style={styles.btn} onPress={handleCalculate}>
            <Text style={styles.btnText}>حساب مؤشر أسلوب الحياة</Text>
          </TouchableOpacity>

          {totalScore > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "white", textAlign: "center", marginBottom: 8 }}>
                مجموع نقاطك: {totalScore} / {maxScore}
              </Text>
              <View style={{ width: "100%", height: 20, borderRadius: 999, backgroundColor: "#1e293b" }}>
                <View
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    backgroundColor:
                      totalScore <= 4 ? "#ef4444" : totalScore <= 7 ? "#eab308" : "#22c55e",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                التصنيف: {category}
              </Text>
            </View>
          )}

          {loadingAdvice && (
            <View style={{ marginTop: 18 }}>
              <ActivityIndicator color="#3b82f6" />
            </View>
          )}
          {!loadingAdvice && aiAdvice !== "" && (
            <View style={{ marginTop: 16, backgroundColor: "#020617", borderRadius: 12, padding: 14 }}>
              <Text style={{ color: "#38bdf8", fontWeight: "bold", marginBottom: 6, textAlign: "right" }}>
                نصيحة مخصصة
              </Text>
              <Text style={{ color: "white", textAlign: "right", lineHeight: 24, fontSize: 14 }}>
                {aiAdvice}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Diabetes Risk (FINDRISC) ============ */
function DiabetesRiskScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [gender, setGender] = useState("male");
  const [activityScore, setActivityScore] = useState(0);
  const [fruitVegScore, setFruitVegScore] = useState(0);
  const [bpMedScore, setBpMedScore] = useState(0);
  const [highSugarScore, setHighSugarScore] = useState(0);
  const [familyScore, setFamilyScore] = useState(0);

  const [totalScore, setTotalScore] = useState(0);
  const [riskLabel, setRiskLabel] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const maxScore = 26;

  const calcAgeScore = (n) => (n < 45 ? 0 : n <= 54 ? 2 : n <= 64 ? 3 : 4);
  const calcBmiScore = (b) => (b < 25 ? 0 : b < 30 ? 1 : 3);
  const calcWaistScore = (w, g) =>
    g === "male" ? (w < 94 ? 0 : w < 102 ? 3 : 4) : (w < 80 ? 0 : w < 88 ? 3 : 4);
  const classifyRisk = (s) =>
    s <= 7 ? "خطر منخفض" : s <= 11 ? "خطر خفيف" : s <= 14 ? "خطر متوسط" : s <= 20 ? "خطر مرتفع" : "خطر مرتفع جدًا";

  const handleCalculate = async () => {
    const ageNum = parseInt(age, 10);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const waistNum = parseFloat(waist);
    if (!name || isNaN(ageNum) || isNaN(h) || isNaN(w) || isNaN(waistNum)) {
      Alert.alert("تنبيه", "أدخل الاسم والعمر والطول والوزن ومحيط الخصر بشكل صحيح.");
      return;
    }
    const bmi = w / Math.pow(h / 100, 2);
    const total =
      calcAgeScore(ageNum) +
      calcBmiScore(bmi) +
      calcWaistScore(waistNum, gender) +
      activityScore +
      fruitVegScore +
      bpMedScore +
      highSugarScore +
      familyScore;

    setTotalScore(total);
    setRiskLabel(classifyRisk(total));

    setLoadingAdvice(true);
    setAiAdvice("");
    try {
      const prompt = `
الاسم: ${name}، العمر: ${ageNum}، الجنس: ${gender === "male" ? "ذكر" : "أنثى"}
BMI تقريبي: ${bmi.toFixed(1)} ، محيط الخصر: ${waistNum} سم
مجموع FINDRISC: ${total}/${maxScore} (${classifyRisk(total)})
أعطني نصيحة عربية قصيرة للوقاية من السكري (≤120 كلمة).
`;
      const ans = await askOpenAI(prompt);
      setAiAdvice(ans || "");
    } catch {
      setAiAdvice("نصيحة عامة: خفّف النشويات المكررة، زِد الألياف، وداوم على نشاط بدني يومي.");
    }
    setLoadingAdvice(false);
  };

  const ratio = Math.min(totalScore / maxScore, 1);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>مقياس خطر الإصابة بالسكري (FINDRISC)</Text>

          <Text style={styles.label}>الاسم</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName}
            placeholder="اسمك" placeholderTextColor="#64748b" />

          <Text style={styles.label}>العمر (سنة)</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge}
            keyboardType="numeric" placeholder="مثال: 45" placeholderTextColor="#64748b" />
          <Text style={styles.helper}>&lt;45 (0) · 45–54 (2) · 55–64 (3) · ≥65 (4)</Text>

          <Text style={styles.label}>الطول (سم)</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight}
            keyboardType="numeric" placeholder="مثال: 170" placeholderTextColor="#64748b" />

          <Text style={styles.label}>الوزن (كجم)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight}
            keyboardType="numeric" placeholder="مثال: 80" placeholderTextColor="#64748b" />
          <Text style={styles.helper}>BMI &lt;25 (0) · 25–30 (1) · &gt;30 (3)</Text>

          <Text style={styles.label}>الجنس</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="ذكر" active={gender === "male"} onPress={() => setGender("male")} />
            <Pill label="أنثى" active={gender === "female"} onPress={() => setGender("female")} />
          </View>

          <Text style={styles.label}>محيط الخصر (سم)</Text>
          <TextInput style={styles.input} value={waist} onChangeText={setWaist}
            keyboardType="numeric" placeholder="مثال: 95" placeholderTextColor="#64748b" />
          <Text style={styles.helper}>
            رجال: &lt;94 (0) · 94–&lt;102 (3) · ≥102 (4) — نساء: &lt;80 (0) · 80–&lt;88 (3) · ≥88 (4)
          </Text>

          <Text style={styles.sectionTitle}>نشاط بدني ≥ 30 دقيقة يوميًا؟</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="نعم" active={activityScore === 0} onPress={() => setActivityScore(0)} />
            <Pill label="لا" active={activityScore === 2} onPress={() => setActivityScore(2)} />
          </View>

          <Text style={styles.sectionTitle}>تتناول خضار/فواكه يوميًا؟</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="نعم" active={fruitVegScore === 0} onPress={() => setFruitVegScore(0)} />
            <Pill label="لا" active={fruitVegScore === 1} onPress={() => setFruitVegScore(1)} />
          </View>

          <Text style={styles.sectionTitle}>تتناول دواءً لارتفاع ضغط الدم؟</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="لا" active={bpMedScore === 0} onPress={() => setBpMedScore(0)} />
            <Pill label="نعم" active={bpMedScore === 2} onPress={() => setBpMedScore(2)} />
          </View>

          <Text style={styles.sectionTitle}>سبق وسُجّل لديك سكر دم مرتفع؟</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pill label="لا" active={highSugarScore === 0} onPress={() => setHighSugarScore(0)} />
            <Pill label="نعم" active={highSugarScore === 5} onPress={() => setHighSugarScore(5)} />
          </View>

          <Text style={styles.sectionTitle}>تاريخ عائلي لمرض السكري؟</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Pill label="لا يوجد" active={familyScore === 0} onPress={() => setFamilyScore(0)} />
            <Pill label="درجة ثانية" active={familyScore === 3} onPress={() => setFamilyScore(3)} />
            <Pill label="درجة أولى" active={familyScore === 5} onPress={() => setFamilyScore(5)} />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleCalculate}>
            <Text style={styles.btnText}>حساب مقياس خطر السكري</Text>
          </TouchableOpacity>

          {totalScore > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "white", textAlign: "center", marginBottom: 8 }}>
                مجموع النقاط: {totalScore} / {maxScore}
              </Text>
              <View style={{ width: "100%", height: 20, borderRadius: 999, backgroundColor: "#1e293b" }}>
                <View
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    backgroundColor:
                      totalScore <= 7
                        ? "#22c55e"
                        : totalScore <= 11
                        ? "#84cc16"
                        : totalScore <= 14
                        ? "#eab308"
                        : totalScore <= 20
                        ? "#f97316"
                        : "#ef4444",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}
              >
                التصنيف: {riskLabel}
              </Text>
            </View>
          )}

          {loadingAdvice && (
            <View style={{ marginTop: 18 }}>
              <ActivityIndicator color="#3b82f6" />
            </View>
          )}
          {!loadingAdvice && aiAdvice !== "" && (
            <View style={{ marginTop: 16, backgroundColor: "#020617", borderRadius: 12, padding: 14 }}>
              <Text style={{ color: "#38bdf8", fontWeight: "bold", marginBottom: 6, textAlign: "right" }}>
                نصيحة مخصصة
              </Text>
              <Text style={{ color: "white", textAlign: "right", lineHeight: 24, fontSize: 14 }}>{aiAdvice}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Stack Navigator (بدون NavigationContainer) ============ */
const Stack = createNativeStackNavigator();

export default function SingleScreenApp() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#020617" } }}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
      <Stack.Screen name="Lifestyle" component={LifestyleIndexScreen} />
      <Stack.Screen name="DiabetesRisk" component={DiabetesRiskScreen} />
    </Stack.Navigator>
  );
}
