import React, { useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const plans = [
  {
    id: "BASIC_PLAN",
    name: "Plan Básico",
    price: import.meta.env.VITE_SUBSCRIPTION_BASIC_PLAN || "5.00",
    description: "Acceso ilimitado a música estándar.",
  },
  {
    id: "PREMIUM_PLAN",
    name: "Plan Premium",
    price: import.meta.env.VITE_SUBSCRIPTION_PREMIUM_PLAN || "10.00",
    description: "Acceso ilimitado a toda la biblioteca de música, playlists exclusivas y descarga offline.",
  },
];

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("Token enviado:", token); // Verifica el token
  
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/subscriptions/get-subscription`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const result = await response.json();
        if (response.ok) {
          setSubscription(result.subscription);
        } else {
          console.error("Error al obtener la suscripción:", result.error);
        }
      } catch (error) {
        console.error("Error al obtener la suscripción:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubscription();
  }, []);
  

  const handleApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();

      if (!selectedPlan) {
        console.error("Error: No se ha seleccionado un plan.");
        return;
      }
      console.log("Selected Plan:", selectedPlan);

      const subscriptionData = {
        planId: selectedPlan.id,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: "ACTIVE",
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/save-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Suscripción creada con éxito");
        setSubscription(subscriptionData);
      } else {
        alert("Error al guardar la suscripción: " + result.error);
      }
    } catch (error) {
      console.error("Error en la aprobación de la suscripción:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-white">
      <h1 className="text-3xl font-bold mb-8">Suscripciones</h1>

      {subscription ? (
        <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Tu Plan Actual</h2>
          <p><strong>Plan:</strong> {subscription.planId}</p>
          <p><strong>Inicio:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
          <p><strong>Fin:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {subscription.status}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="card bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <p className="mb-4">{plan.description}</p>
              <p className="mb-6"><strong>Precio:</strong> ${plan.price}/mes</p>

              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  setSelectedPlan(plan); 
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: plan.price,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  console.log("onApprove ejecutado, data:", data);
                  return handleApprove(data, actions);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;
