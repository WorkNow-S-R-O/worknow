import { useEffect } from 'react';

const SurveyWidget = () => {
	useEffect(() => {
		const scriptId = 'smcx-sdk';

		// Проверяем, не загружен ли уже скрипт
		if (!document.getElementById(scriptId)) {
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.id = scriptId;
			script.src =
				'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdyU2pqpYZCI3tEdSFY4EGCkJzpvUWeYwN5mmOILR_2BapO.js';
			document.body.appendChild(script);
		}
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
				<div id="smcx-survey-container" className="w-full mt-4"></div>
			</div>
		</div>
	);
};

export default SurveyWidget;
