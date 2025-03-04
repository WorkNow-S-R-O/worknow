import { useEffect } from "react";

const SurveyWidget = () => {
  useEffect(() => {
    (function (t, e, s, n) {
      var o, a, c;
      t.SMCX = t.SMCX || [];
      if (!e.getElementById(n)) {
        o = e.getElementsByTagName(s);
        a = o[o.length - 1];
        c = e.createElement(s);
        c.type = "text/javascript";
        c.async = true;
        c.id = n;
        c.src =
          "https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdyU2pqpYZCI3tEdSFY4EGCkJzpvUWeYwN5mmOILR_2BapO.js";
        a.parentNode.insertBefore(c, a);
      }
    })(window, document, "script", "smcx-sdk");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Участвуйте в нашем опросе!
        </h2>
        <p className="text-gray-600 mb-4">
          Ваше мнение важно для нас. Пройдите короткий опрос.
        </p>
        <a
          href="https://ru.surveymonkey.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-lg font-medium hover:underline"
        >
          Составьте собственный опрос для сбора отзывов пользователей
        </a>
      </div>
    </div>
  );
};

export default SurveyWidget;
