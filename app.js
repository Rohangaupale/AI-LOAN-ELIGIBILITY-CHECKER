const $ = (id) => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

function calculateEMI(){
  const P=Number($("emiPrincipal").value)||0, annual=Number($("emiRate").value)||0, years=Number($("emiYears").value)||0;
  const r=annual/12/100, n=years*12;
  const emi = r===0 ? P/n : P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=emi*n;
  $("emiValue").textContent=money(emi||0);
  $("interestValue").textContent=money(Math.max(0,total-P)||0);
  $("paymentValue").textContent=money(total||0);
}
$("calculateEmi").addEventListener("click",calculateEMI);

$("loanForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const income=Number($("income").value), existing=Number($("existingEmi").value), age=Number($("age").value);
  const score=Number($("creditScore").value), requested=Number($("loanAmount").value);
  const dti=(existing/income)*100;
  const pass=income>=25000 && age>=21 && age<=65 && score>=650 && dti<=50;
  const comfortableEmi=Math.max(0,income*.45-existing);
  const message=pass
    ? `<strong>Likely eligible</strong><br>Estimated affordable new EMI: ${money(comfortableEmi)}. Final approval depends on lender policy, documentation and verification.`
    : `<strong>Needs improvement</strong><br>Review your income, credit score, age criteria or existing debt obligations before applying.`;
  const box=$("eligibilityResult"); box.className="result"+(pass?"":" bad"); box.innerHTML=message; box.classList.remove("hidden");
  $("scoreValue").textContent=score;
  const pct=Math.max(0,Math.min(100,(score-300)/6));
  $("scoreMeter").style.width=pct+"%";
  $("score-ring");
  $("scoreLabel").textContent=score>=750?"Excellent credit profile":score>=700?"Good credit profile":score>=650?"Fair credit profile":"Needs improvement";
  $("emiPrincipal").value=requested; calculateEMI();
});

$("generateTips").addEventListener("click",async()=>{
  const income=Number($("income").value)||0, score=Number($("creditScore").value)||0;
  $("tipsOutput").innerHTML="<p><strong>Generating guidance…</strong></p><p>This demo uses local rule-based guidance. Add your Anthropic API key to the optional backend to enable Claude-powered recommendations.</p>";
  setTimeout(()=>{
    const tips=[];
    if(score<750) tips.push("Prioritize on-time repayments and avoid unnecessary hard credit enquiries.");
    else tips.push("Your credit score is a strong starting point; continue keeping utilization and repayments healthy.");
    if(income) tips.push(`With monthly income of ${money(income)}, keep total debt obligations comfortably within your budget.`);
    tips.push("Maintain an emergency fund before taking on a new long-term loan.");
    $("tipsOutput").innerHTML="<p><strong>Personalized guidance</strong></p><ul>"+tips.map(x=>`<li>${x}</li>`).join("")+"</ul>";
  },450);
});

$("saveRecord").addEventListener("click",()=>{
  const record={savedAt:new Date().toISOString(),income:$("income").value,score:$("creditScore").value,loan:$("loanAmount").value};
  localStorage.setItem("loanCheckerRecord",JSON.stringify(record));
  $("saveStatus").textContent="Session saved locally on this device. For Google Sheets persistence, configure the backend environment variables.";
});
calculateEMI();
