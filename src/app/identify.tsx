import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { SnakeImage } from '@/components/snake-image';
import { VenomBadge } from '@/components/venom-badge';
import { colors, MAX_WIDTH, radius, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { useLanguage } from '@/i18n/LanguageProvider';
import { identifyTranslations, type IdentifyLanguage } from '@/data/identifyTranslations';
import { rankSnakes, type Answers } from '@/utils/identify';

type Step = { key: keyof Answers; options: {value:string;icon:IconName;hint?:string}[] };
const STEPS:Step[] = [
 {key:'place',options:[{value:'home',icon:'home-outline'},{value:'field',icon:'leaf-outline'},{value:'forest',icon:'trail-sign-outline'},{value:'tree',icon:'git-branch-outline'},{value:'water',icon:'water-outline'}]},
 {key:'colour',options:[{value:'brown',icon:'ellipse',hint:'#9a7448'},{value:'green',icon:'ellipse',hint:'#4f9a3a'},{value:'dark',icon:'ellipse',hint:'#1b1b1f'},{value:'grey',icon:'ellipse',hint:'#8a8d8a'}]},
 {key:'pattern',options:[{value:'bands',icon:'reorder-four-outline'},{value:'spots',icon:'apps-outline'},{value:'stripes',icon:'remove-outline'},{value:'plain',icon:'square-outline'}]},
 {key:'size',options:[{value:'small',icon:'remove-outline'},{value:'medium',icon:'resize-outline'},{value:'large',icon:'expand-outline'}]},
 {key:'time',options:[{value:'day',icon:'sunny-outline'},{value:'night',icon:'moon-outline'}]},
];
export default function IdentifyScreen(){
 const {colors:theme}=useAppTheme();
 const {language}=useLanguage();
 const tr=identifyTranslations[language as IdentifyLanguage]??identifyTranslations.en;
 const styles=useMemo(()=>makeStyles(theme),[theme]);
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState<Answers>({});
 const done=step>=STEPS.length;
 const answered=Object.values(answers).filter(Boolean).length;
 const results=useMemo(()=>rankSnakes(answers).slice(0,6),[answers]);
 const choose=(value:string|undefined)=>{const key=STEPS[step].key;setAnswers(a=>({...a,[key]:value}));setStep(s=>s+1);};
 const restart=()=>{setAnswers({});setStep(0);};
 return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
  <View style={styles.safety}><Icon name="warning" size={18} color={colors.danger}/><Text style={styles.safetyText}>{tr.safety}</Text></View>
  <View style={styles.progressRow} accessibilityLabel={`${tr.question} ${Math.min(step+1,STEPS.length)} ${tr.of} ${STEPS.length}`}>
   {STEPS.map((s,i)=><View key={s.key} style={[styles.progress,i<step&&styles.progressDone,i===step&&styles.progressNow]}/>)}
  </View>
  {!done?<View style={styles.stepBlock}>
   <Text style={styles.stepCount}>{tr.question} {step+1} {tr.of} {STEPS.length}</Text>
   <Text style={styles.question} accessibilityRole="header">{tr.questions[step]}</Text>
   <View style={styles.options}>{STEPS[step].options.map((o,i)=><Pressable key={o.value} style={({pressed})=>[styles.option,pressed&&styles.optionPressed]} onPress={()=>choose(o.value)} accessibilityRole="button">
    <View style={styles.optionIcon}><Icon name={o.icon} size={22} color={o.hint??theme.text}/></View>
    <Text style={styles.optionText}>{tr.options[step][i]}</Text><Icon name="chevron-forward" size={18} color={theme.muted}/>
   </Pressable>)}</View>
   <View style={styles.stepNav}>{step>0?<Pressable onPress={()=>setStep(s=>s-1)} hitSlop={10} accessibilityRole="button"><Text style={styles.navLink}>{tr.back}</Text></Pressable>:<View/>}
    <Pressable onPress={()=>choose(undefined)} hitSlop={10} accessibilityRole="button"><Text style={styles.navLink}>{tr.skip}</Text></Pressable></View>
  </View>:<View style={styles.stepBlock}>
   <Text style={styles.question} accessibilityRole="header">{tr.closest}</Text>
   <Text style={styles.resultsNote}>{answered===0?tr.skipped:tr.based(answered)}</Text>
   {results.map(({snake,score})=><Pressable key={snake.id} style={({pressed})=>[styles.result,pressed&&styles.optionPressed]} onPress={()=>router.push({pathname:'/snake/[id]',params:{id:snake.id}})} accessibilityRole="button" accessibilityLabel={`${snake.name}, ${Math.round(score*100)}% ${tr.match}`}>
    <SnakeImage snake={snake} style={styles.resultImg}/><View style={{flex:1,gap:4}}><Text style={styles.resultName}>{snake.name}</Text><VenomBadge level={snake.venomLevel}/></View>
    {answered>0&&<View style={styles.score}><Text style={styles.scoreValue}>{Math.round(score*100)}%</Text><Text style={styles.scoreLabel}>{tr.match}</Text></View>}
   </Pressable>)}
   <View style={styles.resultActions}><Button label={tr.again} variant="secondary" icon="refresh" onPress={restart} style={{flex:1}}/><Button label={tr.aid} variant="danger" icon="medkit-outline" onPress={()=>router.navigate('/first-aid')} style={{flex:1}}/></View>
  </View>}
 </ScrollView>;
}
const makeStyles=(theme:ReturnType<typeof useAppTheme>['colors'])=>StyleSheet.create({
 container:{flex:1,backgroundColor:theme.background},content:{padding:space.lg,paddingBottom:48,gap:space.lg,width:'100%',maxWidth:MAX_WIDTH,alignSelf:'center'},
 safety:{flexDirection:'row',gap:space.sm,backgroundColor:theme.dangerBackground,borderRadius:radius.md,padding:space.md},safetyText:{...type.small,color:theme.text,flex:1,fontWeight:'600'},
 progressRow:{flexDirection:'row',gap:6},progress:{flex:1,height:5,borderRadius:3,backgroundColor:theme.border},progressDone:{backgroundColor:colors.leaf},progressNow:{backgroundColor:colors.turmeric},
 stepBlock:{gap:space.md},stepCount:{...type.small,color:theme.muted,fontWeight:'600'},question:{...type.title,color:theme.text},options:{gap:space.sm},
 option:{flexDirection:'row',alignItems:'center',gap:space.md,backgroundColor:theme.card,borderRadius:radius.md,padding:space.md,minHeight:60},optionPressed:{backgroundColor:theme.soft},
 optionIcon:{width:40,height:40,borderRadius:20,backgroundColor:theme.soft,alignItems:'center',justifyContent:'center'},optionText:{...type.bodyStrong,color:theme.text,flex:1},
 stepNav:{flexDirection:'row',justifyContent:'space-between',marginTop:space.xs},navLink:{fontSize:15,fontWeight:'700',color:theme.text,paddingVertical:6},resultsNote:{...type.small,color:theme.muted},
 result:{flexDirection:'row',alignItems:'center',gap:space.md,backgroundColor:theme.card,borderRadius:radius.md,padding:space.sm},resultImg:{width:84,height:60,borderRadius:radius.sm},resultName:{...type.bodyStrong,color:theme.text},
 score:{alignItems:'center',paddingHorizontal:space.sm},scoreValue:{fontSize:18,fontWeight:'800',color:theme.text},scoreLabel:{...type.caption,color:theme.muted},resultActions:{flexDirection:'row',gap:space.sm,marginTop:space.sm}
});
